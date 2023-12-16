import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import {
  cancelButtonText,
  cancelOffer,
  handleOfferConversation,
  handleOfferCallback,
  startOffer,
} from './offer-controller.js'
import { menuKeyboardLabels } from '../main-menu/main-menu-module.js'
import { PretikContext } from '../../types/index.js'
import { channel } from 'diagnostics_channel'

const OfferModule = new Composer<PretikContext>()

OfferModule.hears(cancelButtonText, cancelOffer)

OfferModule.use(createConversation(handleOfferConversation))

OfferModule.hears(menuKeyboardLabels.sendOffer, startOffer)

OfferModule.on('callback_query:data', handleOfferCallback)

export { OfferModule }
