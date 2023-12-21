import { Keyboard } from 'grammy'
import { prisma } from '../../../prisma/client.js'
import { PretikConversation, PretikContext } from '../../../types/index.js'
import { sendMenu } from '../../main-menu/main-menu-controller.js'

const shareNumberKeyboard = new Keyboard()
  .requestContact('Поділитись номером')
  .oneTime()
  .resized()

export async function register(
  conversation: PretikConversation,
  ctx: PretikContext
) {
  await ctx.reply(
    'Привіт!\n' +
      'Мене звати PRETik! Я модератор геніальних ідей, які перетворять «ПРЕТ» на суперкомпанію енергозмін. Якщо маєш  ініціативу, хочеш нею поділитися з колективом і отримати пару гривень у кишеню, я тобі допоможу!\n' +
      'Давай знайомитися!\n',
    { reply_markup: { remove_keyboard: true } }
  )

  await ctx.reply('Залиш свій табельний номер!')
  const employeeTabNumberUpdate = await conversation.waitFor('message:text')

  const userTelegramId = employeeTabNumberUpdate.msg.from.id
  let employeeTabNumber = employeeTabNumberUpdate.msg.text
  let employeeName: string | undefined = ''

  while (!employeeName) {
    employeeName = await conversation.external(() =>
      _getUnregisteredEmployee(employeeTabNumber).then(
        (employee) => employee?.fullName
      )
    )

    if (!employeeName) {
      await ctx.reply('Ах, шахрай! Спробуй ще раз!')
      employeeTabNumber = (await conversation.waitFor('message:text')).msg.text
      continue
    }
  }

  await ctx.reply('Ми тебе вичислити! А тепер вйо')

  await ctx.reply('Поділися номером, аби я міг тобі передзвонити', {
    reply_markup: shareNumberKeyboard,
  })

  const contactMessage = await conversation.waitFor(':contact')
  const { phone_number: phoneNumber } = contactMessage.msg.contact

  await conversation.external(() =>
    _registerUser(userTelegramId, employeeTabNumber, phoneNumber)
  )

  await sendMenu(ctx)
}

async function _getUnregisteredEmployee(employeeTabNumber: string) {
  const employee = await prisma.employee.findUnique({
    where: {
      tabNumber: employeeTabNumber,
      telegramUser: null,
    },
  })
  return employee
}

async function _registerUser(
  telegramId: number,
  tabNumber: string,
  phoneNumber: string
) {
  const result = await prisma.$transaction([
    prisma.user.create({
      data: { id: telegramId, employeeTabNumber: tabNumber },
    }),
    prisma.employee.update({
      where: { tabNumber: tabNumber },
      data: { phone: phoneNumber },
    }),
  ])

  return result
}
