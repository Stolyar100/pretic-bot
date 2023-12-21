import { Context } from 'grammy'

export const isPrivateChat = (ctx: Context) => ctx.chat?.type == 'private'
export const isChannelUpdate = (ctx: Context) => ctx.chat?.type == 'channel'
