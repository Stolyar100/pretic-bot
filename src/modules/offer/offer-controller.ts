import { env, loadEnv } from '../../config/env.js'
loadEnv()
import { Filter, NextFunction } from 'grammy'
import { ZodError, z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { PretikContext } from '../../types/index.js'
import { sendMenu } from '../main-menu/main-menu-controller.js'
import { prisma } from '../../prisma/client.js'
import { handleOfferConversation } from './conversations/handle-offer-conversation.js'
import {
  _generateStatistic,
  _generateStatus,
  offerAcceptedText,
  offerLimitWarning,
  offerNotFoundText,
  offerRejectedText,
  requiresAdminText,
} from './responses.js'
import {
  _countOffers,
  _getStatus,
  offerStatusMenu,
} from './menus/status-menu.js'
export { cancelButtonText } from './responses.js'
export { handleOfferConversation } from './conversations/handle-offer-conversation.js'
export { offerStatusMenu } from './menus/status-menu.js'

const { CHANNEL_ID = 0, OFFER_PER_PAGE } = env

const offerMenuSchema = z.object({
  name: z.literal('OfferStatus'),
  id: z.number(),
  action: z.enum(['REJECT', 'ACCEPT']),
})

export type offerMenuData = z.infer<typeof offerMenuSchema>

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

export async function handleOfferCallback(
  ctx: Filter<PretikContext, 'callback_query:data'>,
  next: NextFunction
) {
  try {
    const { data: rawData } = ctx.callbackQuery
    const { id, action } = await _parseOfferData(rawData)
    const { isAdmin } = ctx.session.auth.user.employeeData

    if (!isAdmin) {
      await ctx.answerCallbackQuery(requiresAdminText)
      return
    }

    if (action == 'ACCEPT') {
      const updatedOffer = await prisma.offer.update({
        where: { id: id, status: 'PENDING' },
        data: { status: 'ACCEPTED' },
      })

      await ctx.copyMessage(CHANNEL_ID)

      await ctx.answerCallbackQuery(offerAcceptedText)
    }
    if (action == 'REJECT') {
      const updatedOffer = await prisma.offer.update({
        where: { id: id, status: 'PENDING' },
        data: { status: 'REJECTED' },
      })

      await ctx.answerCallbackQuery(offerRejectedText)
    }
    await ctx.msg?.editReplyMarkup()
  } catch (e) {
    if (e instanceof ZodError) {
      return await next()
    }
    if (e instanceof PrismaClientKnownRequestError && e.code == 'P2025') {
      return await ctx.answerCallbackQuery(offerNotFoundText)
    }
    throw e
  }
}

async function _parseOfferData(offerPayload: string) {
  const parsedPayload = JSON.parse(offerPayload)
  const offerData = offerMenuSchema.parse(parsedPayload)
  return offerData
}

export async function getStatistic(ctx: PretikContext) {
  const { id } = ctx.session.auth.user

  const offerGroupsCount = await prisma.offer.groupBy({
    where: { authorId: id },
    by: ['status'],
    _count: { _all: true },
  })

  const pendingCount = offerGroupsCount.find(
    (offerGroup) => offerGroup.status == 'PENDING'
  )?._count._all
  const rejectedCount = offerGroupsCount.find(
    (offerGroup) => offerGroup.status == 'REJECTED'
  )?._count._all
  const acceptedCount = offerGroupsCount.find(
    (offerGroup) => offerGroup.status == 'ACCEPTED'
  )?._count._all

  await ctx.reply(
    _generateStatistic(pendingCount, rejectedCount, acceptedCount)
  )
}

export async function sendStatusMenu(ctx: PretikContext) {
  const { id } = ctx.session.auth.user
  const [offersCount, firstStatusPage] = await Promise.all([
    _countOffers(id),
    _getStatus(id, 0, OFFER_PER_PAGE),
  ])
  const pagesCount = calcPagesCount(offersCount, OFFER_PER_PAGE)

  ctx.session.offerStatus = {
    offersPerPage: OFFER_PER_PAGE,
    page: 0,
    pagesCount: pagesCount,
  }
  const statusMessage = _generateStatus(firstStatusPage, 0, pagesCount)
  return await ctx.reply(statusMessage, { reply_markup: offerStatusMenu })
}

function calcPagesCount(offersCount: number, offersPerPage: number) {
  const pagesCount = Math.ceil(offersCount / offersPerPage)
  return pagesCount
}
