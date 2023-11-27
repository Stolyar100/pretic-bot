import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { Context, SessionFlavor } from 'grammy'

export type PretikContext = Context &
  ConversationFlavor &
  SessionFlavor<SessionData>

export type PretikConversation = Conversation<PretikContext>

interface SessionData {
  offerDraft: OfferDraft
}

interface OfferDraft {
  shortName: string | null
  reasons: string | null
  content: string | null
  solvesProblem: string | null
  responsibleDepartment: string | null
}
