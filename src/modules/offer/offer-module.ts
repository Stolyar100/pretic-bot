import {
  Conversation,
  ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations'
import { Composer, Context, session } from 'grammy'
import {
  cancelButtonText,
  handleOfferConversation,
} from './offer-controller.js'
import {
  MainMenuModule,
  menuKeyboardLabels,
  sendMenu,
} from '../main-menu/main-menu-module.js'
import { PretikContext } from '../../types/index.js'

const OfferModule = new Composer<PretikContext>()

OfferModule.hears(cancelButtonText, async (ctx) => {
  await ctx.conversation.exit(handleOfferConversation.name)
  await ctx.reply('Нє - то нє')
  await sendMenu(ctx)
})

OfferModule.use(createConversation(handleOfferConversation))

OfferModule.hears(menuKeyboardLabels.sendOffer, async (ctx) => {
  await ctx.conversation.enter(handleOfferConversation.name)
})

export { OfferModule }
