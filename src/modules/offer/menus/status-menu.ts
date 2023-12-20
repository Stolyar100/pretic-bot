import { Menu } from '@grammyjs/menu'
import {
  _generateStatus,
  offerCloseText,
  offerNextText,
  offerPreviousText,
  paginationLimitText,
} from '../responses.js'
import { PretikContext } from '../../../types/index.js'
import { prisma } from '../../../prisma/client.js'

export const offerStatusMenu = new Menu<PretikContext>('offer-status-menu')
  .text(offerPreviousText, async (ctx) => {
    const { id } = ctx.session.auth.user
    const { offersPerPage, page, pagesCount } = ctx.session.offerStatus

    if (page == 0) {
      return ctx.answerCallbackQuery(paginationLimitText)
    }

    const PreviousStatusPage = await _getStatus(id, page - 1, offersPerPage)
    const statusMessage = _generateStatus(
      PreviousStatusPage,
      page - 1,
      pagesCount
    )

    ctx.session.offerStatus.page -= 1

    return await ctx.editMessageText(statusMessage)
  })
  .text(offerNextText, async (ctx) => {
    const { id } = ctx.session.auth.user
    const { offersPerPage, page, pagesCount } = ctx.session.offerStatus

    if (page == pagesCount) {
      return ctx.answerCallbackQuery(paginationLimitText)
    }

    const nextStatusPage = await _getStatus(id, page + 1, offersPerPage)
    const statusMessage = _generateStatus(nextStatusPage, page + 1, pagesCount)

    ctx.session.offerStatus.page += 1

    return await ctx.editMessageText(statusMessage)
  })
  .row()
  .text(offerCloseText, (ctx) => ctx.msg?.delete())

export async function _getStatus(
  userId: number,
  page: number,
  offersPerPage: number
) {
  const status = await prisma.offer.findMany({
    where: { authorId: userId },
    select: { shortName: true, status: true },
    take: offersPerPage,
    skip: offersPerPage * page,
  })
  return status
}

export async function _countOffers(userId: number) {
  const offerCount = await prisma.offer.count({ where: { authorId: userId } })
  return offerCount
}
