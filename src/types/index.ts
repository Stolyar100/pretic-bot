import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { Context, SessionFlavor } from 'grammy'
import type { User } from '.prisma/client'

export type PretikContext = Context &
  ConversationFlavor &
  SessionFlavor<SessionData>

export type PretikConversation = Conversation<PretikContext>

interface SessionData {
  auth: Auth
  offerDraft: OfferDraft
}

interface Auth {
  user: User
  isAdmin: boolean
}

interface OfferDraft {
  shortName: string | null
  reasons: string | null
  content: string | null
  solvesProblem: string | null
  responsibleDepartment: string | null
}
