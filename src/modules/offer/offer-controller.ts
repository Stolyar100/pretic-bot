import { PretikContext } from '../../types/index.js'
import { sendMenu } from '../main-menu/main-menu-controller.js'
import { prisma } from '../../prisma/client.js'
import { handleOfferConversation } from './conversations/handle-offer-conversation.js'
import { offerLimitWarning } from './responses.js'
export { cancelButtonText } from './responses.js'
export { handleOfferConversation } from './conversations/handle-offer-conversation.js'

export async function cancelOffer(ctx: PretikContext) {
  await ctx.conversation.exit(handleOfferConversation.name)
  await ctx.reply('Нє - то нє')
  await sendMenu(ctx)
}

export async function startOffer(ctx: PretikContext) {
  const isLimitReached = await _isLimitReached(ctx.from?.id)
  if (isLimitReached) {
    await ctx.reply(offerLimitWarning)
    return
  }

  await ctx.conversation.enter(handleOfferConversation.name)
}

async function _isLimitReached(userId: number | undefined): Promise<boolean> {
  const todayOfferCount = await prisma.offer.count({
    where: {
      creationDate: new Date(),
      authorId: userId,
    },
  })

  return todayOfferCount > 2
}
