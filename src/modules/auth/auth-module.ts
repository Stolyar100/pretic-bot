import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { PretikContext } from '../../types/index.js'
import { register } from './auth-controller.js'

const AuthModule = new Composer<PretikContext>()

AuthModule.use(createConversation(register, {}))

AuthModule.command(
  'start',
  async (ctx) => await ctx.conversation.enter(register.name)
)

export { AuthModule }
