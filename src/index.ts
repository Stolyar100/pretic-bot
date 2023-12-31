import { env, loadEnv } from './config/env.js'
loadEnv()
import { Bot, BotError, MemorySessionStorage, session } from 'grammy'
import { conversations } from '@grammyjs/conversations'
import { MainMenuModule } from './modules/main-menu/main-menu-module.js'
import { AuthModule } from './modules/auth/auth-module.js'
import { PretikContext } from './types/index.js'
import { OfferModule } from './modules/offer/offer-module.js'
import { errorHandler } from './helpers/errorHandler.js'
import { hydrate } from '@grammyjs/hydrate'
import { isChannelUpdate } from './helpers/filters.js'
import { UtilsModule } from './modules/utils/utils-module.js'

const { BOT_TOKEN, STORAGE_TIMEOUT } = env

const memoryStorage = new MemorySessionStorage(STORAGE_TIMEOUT)

const pretikBot = new Bot<PretikContext>(BOT_TOKEN)

pretikBot.catch((err: BotError) => errorHandler(err))

pretikBot.use(UtilsModule)

pretikBot.use((ctx, next) => !isChannelUpdate(ctx) && next())

pretikBot.use(
  session({
    storage: memoryStorage,
    initial: () => ({
      offerDraft: {},
    }),
    getSessionKey(ctx) {
      return ctx.from?.id.toString()
    },
  })
)

pretikBot.use(hydrate())
pretikBot.use(conversations())

pretikBot.use(AuthModule)
pretikBot.use(MainMenuModule)
pretikBot.use(OfferModule)

void pretikBot.start()
