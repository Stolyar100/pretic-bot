import { env, loadEnv } from './config/env.js'
loadEnv()
import { Bot, BotError, session } from 'grammy'
import { conversations } from '@grammyjs/conversations'
import { MainMenuModule } from './modules/main-menu/main-menu-module.js'
import { AuthModule } from './modules/auth/auth-module.js'
import { PretikContext } from './types/index.js'
import { OfferModule } from './modules/offer/offer-module.js'
import { errorHandler } from './helpers/errorHandler.js'
import { hydrate } from '@grammyjs/hydrate'
import { FileAdapter } from '@grammyjs/storage-file'

const { BOT_TOKEN } = env

const pretikBot = new Bot<PretikContext>(BOT_TOKEN)

pretikBot.catch((err: BotError) => errorHandler(err))

const fileStorage = new FileAdapter({ dirName: 'sessions' })

pretikBot.use(
  session({
    storage: fileStorage,
    initial: () => ({
      offerDraft: {},
    }),
  })
)
pretikBot.use(hydrate())
pretikBot.use(conversations())

pretikBot.errorBoundary((err: BotError) => errorHandler(err)).use(AuthModule)
pretikBot
  .errorBoundary((err: BotError) => errorHandler(err))
  .use(MainMenuModule)
pretikBot.errorBoundary((err: BotError) => errorHandler(err)).use(OfferModule)

pretikBot.command('id', (ctx) => ctx.reply(`${JSON.stringify(ctx.chat)}`))

void pretikBot.start()
