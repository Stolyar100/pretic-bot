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

const { CONVERSATION_TIMEOUT } = env

const OfferModule = new Composer<PretikContext>()

OfferModule.hears(cancelButtonText, cancelOffer)

OfferModule.use(
  createConversation(handleOfferConversation, {
    maxMillisecondsToWait: CONVERSATION_TIMEOUT,
  })
)

OfferModule.use(offerStatusMenu)

OfferModule.hears(menuKeyboardLabels.sendOffer, startOffer)
OfferModule.hears(menuKeyboardLabels.getStatistic, getStatistic)
OfferModule.hears(menuKeyboardLabels.getStatus, sendStatusMenu)

OfferModule.on('callback_query:data', handleOfferCallback)

export { OfferModule }
