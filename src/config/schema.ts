const schema = {
  BOT_TOKEN: String,
  DATABASE_URL: String,
  CHANNEL_INVITE_URL: { type: String, optional: true },
  CHANNEL_ID: { type: Number, optional: true },
  ADMINS_GROUP_ID: { type: Number, optional: true },
  CONVERSATION_TIMEOUT: { type: Number, default: 5 * 60 * 1000 },
  OFFER_PER_PAGE: { type: Number, default: 5 },
} as const

export default schema
