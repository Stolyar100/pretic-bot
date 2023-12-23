const schema = {
  BOT_TOKEN: String,
  DATABASE_URL: String,
  CHANNEL_INVITE_URL: String,
  CHANNEL_ID: Number,
  ADMINS_GROUP_ID: Number,
  CONVERSATION_TIMEOUT: { type: Number, default: 5 * 60 * 1000 },
  STORAGE_TIMEOUT: { type: Number, default: 6 * 60 * 60 * 1000 },
  OFFER_PER_PAGE: { type: Number, default: 5 },
} as const

export default schema
