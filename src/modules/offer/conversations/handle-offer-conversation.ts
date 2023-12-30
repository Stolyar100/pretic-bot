import { env, loadEnv } from '../../../config/env.js'
loadEnv()
import { prisma } from '../../../prisma/client.js'
import { PretikContext, PretikConversation } from '../../../types/index.js'
import { z } from 'zod'
import { sendMenu } from '../../main-menu/main-menu-controller.js'
import {
  editSubmitKeyboard,
  editButtonText,
  submitButtonText,
  cancelKeyboard,
  _renderOfferMessage,
  departmentKeyboard,
  offerDraftMap,
  offerFieldLabels,
  selectOfferFieldKeyboard,
  _generateOfferInline,
  photoKeyboard,
  sendPhotoText,
  skipPhotoText,
} from '../responses.js'
import { Context } from 'grammy'

const { ADMINS_GROUP_ID, BOT_TOKEN } = env

const shortNameSchema = z.string().max(70)

export async function handleOfferConversation(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  ctx.session.offerDraft = {
    content: null,
    reasons: null,
    responsibleDepartment: null,
    shortName: null,
    solvesProblem: null,
    photo: null,
  }
  do {
    if (!_isOfferFieldFilled(ctx, 'shortName')) {
      await _requestShortName(conversation, ctx)
    }
    if (!_isOfferFieldFilled(ctx, 'reasons')) {
      await _requestReasons(conversation, ctx)
    }
    if (!_isOfferFieldFilled(ctx, 'solvesProblem')) {
      await _requestSolvesProblem(conversation, ctx)
    }

    if (!_isOfferFieldFilled(ctx, 'content')) {
      await _requestContent(conversation, ctx)
    }
    if (!_isOfferFieldFilled(ctx, 'responsibleDepartment')) {
      await _requestResponsibleDepartment(conversation, ctx)
    }
    if (!_isOfferFieldFilled(ctx, 'photo')) {
      await _requestPhoto(conversation, ctx)
    }

    await ctx.reply('Шо, полетіли?', {
      reply_markup: editSubmitKeyboard,
    })
    const editSubmitResponse = await conversation.form.select([
      editButtonText,
      submitButtonText,
    ])

    if (editSubmitResponse == submitButtonText) {
      break
    }

    await _selectFieldToEdit(conversation, ctx)
  } while (!_isOfferFilled(ctx.session.offerDraft))

  const shortName = ctx.session.offerDraft.shortName
  const authorId = ctx.from?.id

  if (!shortName || !authorId) {
    return await ctx.reply('Шось не так')
  }

  const createdOffer = await conversation.external(() =>
    prisma.offer.create({
      data: {
        shortName,
        authorId,
      },
    })
  )

  const { fullName, phone } = ctx.session.auth.user.employeeData

  if (ctx.session.offerDraft.photo == '') {
    const offerMessage = await ctx.api.sendMessage(
      ADMINS_GROUP_ID,
      _renderOfferMessage(ctx.session.offerDraft),
      {
        parse_mode: 'HTML',
        reply_markup: _generateOfferInline(createdOffer.id),
      }
    )
    await ctx.api.sendContact(ADMINS_GROUP_ID, phone || '', fullName || '', {
      reply_to_message_id: offerMessage.message_id,
      disable_notification: true,
    })
  } else {
    const offerPhotoMessage = await ctx.api
      .sendPhoto(ADMINS_GROUP_ID, ctx.session.offerDraft.photo || '', {
        caption: _renderOfferMessage(ctx.session.offerDraft),
        parse_mode: 'HTML',
        reply_markup: _generateOfferInline(createdOffer.id),
      })
      .catch((err) =>
        ctx.reply(
          'Тут такі пироги: Якщо надсилати знимку, телеграм не дає прикріпити більше 1024 символів'
        )
      )
    await ctx.api.sendContact(ADMINS_GROUP_ID, phone || '', fullName || '', {
      reply_to_message_id: offerPhotoMessage.message_id,
      disable_notification: true,
    })
  }

  await ctx.reply('Дякую за те, що покращуєш PRET!', {
    reply_markup: { remove_keyboard: true },
  })

  await sendMenu(ctx)
}

function _isOfferFieldFilled(
  ctx: PretikContext,
  offerField: keyof PretikContext['session']['offerDraft']
) {
  return ctx.session.offerDraft?.[offerField] != undefined
}

function _isOfferFilled(offerDraft: PretikContext['session']['offerDraft']) {
  return Object.values(offerDraft).every((field) => field != undefined)
}

async function _requestShortName(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Коротка назва пропозиції', {
    reply_markup: cancelKeyboard,
  })
  const shortName = await _askValidShortName(conversation, ctx)
  ctx.session.offerDraft.shortName = shortName
}

async function _askValidShortName(
  conversation: PretikConversation,
  ctx: PretikContext
): Promise<string> {
  try {
    const shortName = await conversation.waitFor('message:text')

    return shortNameSchema.parse(shortName.msg.text)
  } catch (error) {
    await ctx.reply('Я ж просив коротше!')
    return _askValidShortName(conversation, ctx)
  }
}

async function _requestReasons(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Передумови/причини/обгрунтування', {
    reply_markup: cancelKeyboard,
  })
  const reasons = (await conversation.waitFor('message:text')).message.text
  ctx.session.offerDraft.reasons = reasons
}

async function _requestContent(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Зміст', {
    reply_markup: cancelKeyboard,
  })
  const content = (await conversation.waitFor('message:text')).message.text
  ctx.session.offerDraft.content = content
}

async function _requestSolvesProblem(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Яку проблему це вирішить або що покращить', {
    reply_markup: cancelKeyboard,
  })

  const solvesProblem = (await conversation.waitFor('message:text')).message
    .text
  ctx.session.offerDraft.solvesProblem = solvesProblem
}

async function _requestResponsibleDepartment(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Ну і в чий город цей камінь?', {
    reply_markup: departmentKeyboard,
  })
  const responsibleDepartment = (await conversation.waitFor('message:text'))
    .message.text

  ctx.session.offerDraft.responsibleDepartment = responsibleDepartment
}

async function _requestPhoto(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Хочеш додати знимку?', {
    reply_markup: photoKeyboard,
  })
  const sendOrSkip = await conversation.form.select([
    sendPhotoText,
    skipPhotoText,
  ])

  if (sendOrSkip == skipPhotoText) {
    return (ctx.session.offerDraft.photo = '')
  }

  await ctx.reply('Файно, надсилай одну знимку')

  const photoFileId =
    (await conversation.waitFor(':photo')).msg.photo.pop()?.file_id || ''

  ctx.session.offerDraft.photo = photoFileId
}

async function _selectFieldToEdit(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Шо вже не то?', { reply_markup: selectOfferFieldKeyboard })
  const fieldToEditResponse = await conversation.form.select(offerFieldLabels)
  const fieldToEditKeyValue = Object.entries(offerDraftMap).find(
    (offerDraftField) => offerDraftField[1] == fieldToEditResponse
  ) as [string, any]
  const fieldToEdit =
    fieldToEditKeyValue[0] as string as keyof PretikContext['session']['offerDraft']
  ctx.session.offerDraft[fieldToEdit] = null
}

async function _getAdminId(adminTabNumber: string) {
  const admin = await prisma.user.findUnique({
    where: { employeeTabNumber: adminTabNumber },
    select: { id: true },
  })

  return admin?.id
}
