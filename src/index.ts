import { env, loadEnv } from './config/env.js'
loadEnv()
import { Bot, BotError, session } from 'grammy'
import { conversations } from '@grammyjs/conversations'
import { MainMenuModule } from './modules/main-menu/main-menu-module.js'
import { AuthModule } from './modules/auth/auth-module.js'
import { PretikContext } from './types/index.js'
import { OfferModule } from './modules/offer/offer-module.js'
import { errorHandler } from './helpers/errorHandler.js'

const { BOT_TOKEN } = env

const pretikBot = new Bot<PretikContext>(BOT_TOKEN)

pretikBot.catch((err: BotError) => errorHandler(err))

pretikBot.use(
  session({
    initial: () => ({
      offerDraft: {},
    }),
  })
)
pretikBot.use(conversations())

pretikBot.errorBoundary((err: BotError) => errorHandler(err)).use(AuthModule)
pretikBot
  .errorBoundary((err: BotError) => errorHandler(err))
  .use(MainMenuModule)
pretikBot.errorBoundary((err: BotError) => errorHandler(err)).use(OfferModule)

pretikBot.command('id', (ctx) => ctx.reply(`${ctx.from?.id}`))

void pretikBot.start()
