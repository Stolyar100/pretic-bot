import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { Context, SessionFlavor } from 'grammy'

export type PretikContext = Context &
  ConversationFlavor &
  SessionFlavor<SessionData>

export type PretikConversation = Conversation<PretikContext>

interface SessionData {
  employeeData: employeeData
}

interface employeeData {
  employeeId: string
  employeeName: string
  employeePhoneNumber: string
}
