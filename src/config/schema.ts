const schema = {
  BOT_TOKEN: String,
  DATABASE_URL: String,
  CHANNEL_INVITE_URL: String,
  CHANNEL_ID: Number,
  ADMIN_TAB_NUMBER: String,
  CONVERSATION_TIMEOUT: { type: Number, default: 5 * 60 * 1000 },
} as const

export default schema
