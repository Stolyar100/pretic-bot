import { Keyboard } from 'grammy'
import { z } from 'zod'
import { PretikContext, PretikConversation } from '../../types/index.js'
import { sendMenu } from '../main-menu/main-menu-controller.js'

const shortNameSchema = z.string().max(70)

const departments = [
  'ІТ',
  'Маркетинг',
  'Департамент розвитку',
  'Обслуговування',
  'Правове питання',
  'Персонал',
  'В сусіднє село',
] as const

const departmentKeyboard = Keyboard.from(
  departments.map((departmentLabel) => [Keyboard.text(departmentLabel)])
)
  .resized()
  .toFlowed(2)

export const cancelButtonText = 'Йой, нє'
export const editButtonText = 'Йой, шось не то! Вернутись'
export const submitButtonText = 'Файно є'

const cancelButtonRow = [[Keyboard.text(cancelButtonText)]]
const editButtonRow = [[Keyboard.text(editButtonText)]]
const submitButtonRow = [[Keyboard.text(submitButtonText)]]

const cancelKeyboard = Keyboard.from(cancelButtonRow).resized()
const editSubmitKeyboard = Keyboard.from([...editButtonRow, ...submitButtonRow])
  .resized()
  .toFlowed(2)
  .append(cancelKeyboard)

const offerDraftMap: PretikContext['session']['offerDraft'] = {
  content: 'Зміст',
  reasons: 'Передумови',
  responsibleDepartment: 'В чий город',
  shortName: 'Коротка назва',
  solvesProblem: 'Вирішує проблему',
} as const

const offerFieldLabels = Object.values(offerDraftMap)

const selectOfferFieldKeyboard = Keyboard.from(
  offerFieldLabels.map((offerFieldLabel) => [Keyboard.text(offerFieldLabel)])
)
  .resized()
  .toFlowed(2)
  .append(cancelKeyboard)

export async function cancelOffer(ctx: PretikContext) {
  await ctx.conversation.exit(handleOfferConversation.name)
  await ctx.reply('Нє - то нє')
  await sendMenu(ctx)
}

export async function startOffer(ctx: PretikContext) {
  await ctx.conversation.enter(handleOfferConversation.name)
}

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

  await ctx.reply('Дякую за те, що покращуєш PRET!')

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
    reply_markup: departmentKeyboard.append(cancelKeyboard),
  })
  const responsibleDepartment = (await conversation.waitFor('message:text'))
    .message.text

  ctx.session.offerDraft.responsibleDepartment = responsibleDepartment
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
