import {
  Conversation,
  ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations'
import { Composer, Context, Keyboard, SessionFlavor, session } from 'grammy'

interface SessionData {
  employeeData: {
    employeeId: string
    employeeName: string
    employeePhoneNumber: string
  }
}

type MyContext = Context & ConversationFlavor & SessionFlavor<SessionData>
type MyConversation = Conversation<MyContext>

const AuthModule = new Composer<MyContext>()

AuthModule.use(session({ initial: () => ({}) }))
AuthModule.use(conversations())

const shareNumberKeyboard = new Keyboard()
  .requestContact('Поділитись номером')
  .oneTime()

const register = async (conversation: MyConversation, ctx: MyContext) => {
  await ctx.reply('Залиш свій табельний номер!')
  let employeeId = await (await conversation.waitFor('message:text')).msg?.text

  while (!ctx.session.employeeData.employeeName) {
    const employeeName = await conversation.external(() => {
      if (employeeId == '1111') {
        return `Ім'я Прізвище`
      }
    })

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
  const employeePhoneNumber = (await conversation.waitFor(':contact')).msg
    .contact.phone_number
  ctx.session.employeeData.employeePhoneNumber = employeePhoneNumber
  await ctx.reply('Ну шо, ґаздуємо! Що ти там придумав сьогодні?')
}

AuthModule.use(createConversation(register))

export { AuthModule }
