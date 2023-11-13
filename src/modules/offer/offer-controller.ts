import { Conversation } from '@grammyjs/conversations'
import { Context, Keyboard } from 'grammy'
import { z } from 'zod'
import { PretikContext, PretikConversation } from '../../types/index.js'
import { sendMenu } from '../main-menu/main-menu-controller.js'

const shortNameSchema = z.string().max(70)

export const cancelButtonText = 'Йой, нє'

const cancelButton = [[Keyboard.text(cancelButtonText)]]

const departments = [
  'ІТ',
  'Маркетинг',
  'Департамент розвитку',
  'Обслуговування',
  'Правове питання',
  'Персонал',
  'В сусіднє село',
] as const

const departmentButtonRows = departments.map((departmentLabel) => [
  Keyboard.text(departmentLabel),
])

export async function handleOfferConversation(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Коротка назва пропозиції', {
    reply_markup: Keyboard.from(cancelButton),
  })
  const shortNameMessage = await _requestShortName(conversation, ctx)

  await ctx.reply('Передумови/причини/обгрунтування')
  const reasons = (await conversation.waitFor('message:text')).message.text

  await ctx.reply('Зміст')
  const content = (await conversation.waitFor('message:text')).message.text

  await ctx.reply('Яку проблему це вирішить або що покращить')
  const solvesProblem = (await conversation.waitFor('message:text')).message
    .text

  await ctx.reply('Ну і в чий город цей камінь?', {
    reply_markup: Keyboard.from([...departmentButtonRows, ...cancelButton]),
  })
  const responsibleDepartment = (await conversation.waitFor('message:text'))
    .message.text

  // await ctx.reply('Хочеш додати')
  // const recievedAttachmentMessage = (
  //   await conversation.waitFor(['message:photo', '])
  // )

  //   if(recievedAttachmentMessage)

  await sendMenu(ctx)
}

async function _requestShortName(
  conversation: PretikConversation,
  ctx: PretikContext
): Promise<string> {
  try {
    const shortName = (await conversation.waitFor('message:text')).message.text
    return shortNameSchema.parse(shortName)
  } catch (error) {
    await ctx.reply('Я ж просив коротше!')
    return _requestShortName(conversation, ctx)
  }
}
