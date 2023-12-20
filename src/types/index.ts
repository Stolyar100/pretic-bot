import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { Prisma } from '@prisma/client'
import { Context, SessionFlavor } from 'grammy'

export type PretikContext = HydrateFlavor<
  Context & ConversationFlavor & SessionFlavor<SessionData>
>

export type PretikConversation = Conversation<PretikContext>

interface SessionData {
  auth: Auth
  offerDraft: OfferDraft
  offerStatus: OfferStatusMenu
}

interface Auth {
  user: Prisma.UserGetPayload<{ include: { employeeData: true } }>
  isAdmin: boolean
}

interface OfferDraft {
  shortName: string | null
  reasons: string | null
  content: string | null
  solvesProblem: string | null
  responsibleDepartment: string | null
}

interface OfferStatusMenu {
  offersPerPage: number
  page: number
  pagesCount: number
}
