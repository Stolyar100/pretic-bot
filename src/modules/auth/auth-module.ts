import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { PretikContext } from '../../types/index.js'
import { authentication, register } from './auth-controller.js'

const AuthModule = new Composer<PretikContext>()

AuthModule.use(createConversation(register, {}))

AuthModule.use(authentication)

export { AuthModule }
