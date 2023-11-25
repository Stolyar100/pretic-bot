import { Keyboard, NextFunction } from 'grammy'
import { PretikConversation, PretikContext } from '../../types/index.js'
import { sendMenu } from '../main-menu/main-menu-controller.js'
import { prisma } from '../../prisma/client.js'

const shareNumberKeyboard = new Keyboard()
  .requestContact('Поділитись номером')
  .oneTime()

export async function authentication(ctx: PretikContext, next: NextFunction) {
  const userId = ctx.from?.id

  if (!userId) {
    await next()
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { employeeData: true },
  })

  if (!user) {
    await ctx.conversation.enter(register.name)
  }

  await next()
}

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
  const employeeIdUpdate = await conversation.waitFor('message:text')

  const userTelegramId = employeeIdUpdate.msg.from.id
  let employeeId = employeeIdUpdate.msg.text
  let employeeName: string | undefined = ''

  while (!employeeName) {
    employeeName = await conversation.external(() =>
      _getUnregisteredEmployee(employeeId).then(
        (employee) => employee?.fullName
      )
    )

    if (!employeeName) {
      await ctx.reply('Ах, шахрай! Спробуй ще раз!')
      employeeId = (await conversation.waitFor('message:text')).msg.text
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
    _registerUser(userTelegramId, employeeId, phoneNumber)
  )

  await sendMenu(ctx)
}

async function _getUnregisteredEmployee(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: {
      tabNumber: employeeId,
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
