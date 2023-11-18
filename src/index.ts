import { env, loadEnv } from './config/env.js'
loadEnv()
import { Bot, BotError, GrammyError, HttpError, session } from 'grammy'
import { conversations } from '@grammyjs/conversations'
import { MainMenuModule } from './modules/main-menu/main-menu-module.js'
import { AuthModule } from './modules/auth/auth-module.js'
import { PretikContext } from './types/index.js'
import { OfferModule } from './modules/offer/offer-module.js'

const { BOT_TOKEN } = env

const pretikBot = new Bot<PretikContext>(BOT_TOKEN)

const errorHandler = (err: BotError) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e)
  } else {
    console.error('Unknown error:', e)
  }
}

pretikBot.catch((err: BotError) => errorHandler(err))

pretikBot.use(
  session({
    initial: () => ({
      employeeData: {},
      offerDraft: {},
    }),
  })
)
pretikBot.use(conversations())

pretikBot.use(MainMenuModule)
pretikBot.errorBoundary((err: BotError) => errorHandler(err)).use(AuthModule)
pretikBot.errorBoundary((err: BotError) => errorHandler(err)).use(OfferModule)

pretikBot.command('id', (ctx) => ctx.reply(`${ctx.from?.id}`))

void pretikBot.start()
