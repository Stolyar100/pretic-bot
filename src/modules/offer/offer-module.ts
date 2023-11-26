import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import {
  cancelButtonText,
  cancelOffer,
  handleOfferConversation,
  startOffer,
} from './offer-controller.js'
import { menuKeyboardLabels } from '../main-menu/main-menu-module.js'
import { PretikContext } from '../../types/index.js'

const OfferModule = new Composer<PretikContext>()

OfferModule.hears(cancelButtonText, cancelOffer)

OfferModule.use(createConversation(handleOfferConversation))

OfferModule.hears(menuKeyboardLabels.sendOffer, startOffer)

export { OfferModule }
