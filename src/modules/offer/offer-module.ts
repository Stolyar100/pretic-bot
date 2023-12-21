import { env, loadEnv } from '../../config/env.js'
loadEnv()
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import {
  cancelButtonText,
  cancelOffer,
  handleOfferConversation,
  handleOfferCallback,
  startOffer,
  getStatistic,
  sendStatusMenu,
} from './offer-controller.js'
import { menuKeyboardLabels } from '../main-menu/main-menu-module.js'
import { PretikContext } from '../../types/index.js'
import { offerStatusMenu } from './offer-controller.js'
import { isPrivateChat } from '../../helpers/filters.js'

const { CONVERSATION_TIMEOUT } = env

const OfferModule = new Composer<PretikContext>()

OfferModule.filter(isPrivateChat).hears(cancelButtonText, cancelOffer)

OfferModule.filter(isPrivateChat).use(
  createConversation(handleOfferConversation, {
    maxMillisecondsToWait: CONVERSATION_TIMEOUT,
  })
)

OfferModule.filter(isPrivateChat).use(offerStatusMenu)

OfferModule.filter(isPrivateChat).hears(
  menuKeyboardLabels.sendOffer,
  startOffer
)
OfferModule.filter(isPrivateChat).hears(
  menuKeyboardLabels.getStatistic,
  getStatistic
)
OfferModule.filter(isPrivateChat).hears(
  menuKeyboardLabels.getStatus,
  sendStatusMenu
)

OfferModule.on('callback_query:data', handleOfferCallback)

export { OfferModule }
