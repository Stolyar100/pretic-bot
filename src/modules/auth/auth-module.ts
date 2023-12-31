import { env, loadEnv } from '../../config/env.js'
loadEnv()
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { PretikContext } from '../../types/index.js'
import { authentication, register } from './auth-controller.js'
import { isPrivateChat } from '../../helpers/filters.js'

const { CONVERSATION_TIMEOUT } = env

const AuthModule = new Composer<PretikContext>()

AuthModule.on('message').drop((ctx) => !isPrivateChat(ctx))

AuthModule.use(
  createConversation(register, { maxMillisecondsToWait: CONVERSATION_TIMEOUT })
)

AuthModule.on(['message', 'callback_query', 'edit'], authentication)

export { AuthModule }
