import { Keyboard } from 'grammy'
import { PretikConversation, PretikContext } from '../../types/index.js'
import { sendMenu } from '../main-menu/main-menu-controller.js'

const shareNumberKeyboard = new Keyboard()
  .requestContact('Поділитись номером')
  .oneTime()

export async function register(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply('Залиш свій табельний номер!')
  let employeeId = await (await conversation.waitFor('message:text')).msg?.text

  while (!ctx.session.employeeData?.employeeName) {
    const employeeName = employeeId == '1111' && `Ім'я Прізвище`

    if (!employeeName) {
      await ctx.reply('Ах, шахрай! Спробуй ще раз!')
      employeeId = (await conversation.waitFor('message:text')).msg.text
      continue
    }

    ctx.session.employeeData.employeeId = employeeId
    ctx.session.employeeData.employeeName = employeeName

    await ctx.reply('Ми тебе вичислити! А тепер вйо')
  }

  await ctx.reply('Поділися номером, аби я міг тобі передзвонити', {
    reply_markup: shareNumberKeyboard,
  })

  const { phone_number: employeePhoneNumber, user_id: userTelegramId } = (
    await conversation.waitFor(':contact')
  ).msg.contact

  ctx.session.employeeData.employeePhoneNumber = employeePhoneNumber

  await sendMenu(ctx)
}
