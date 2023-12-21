import { loadEnv } from '../../config/env.js'
loadEnv()
import { NextFunction } from 'grammy'
import { PretikContext } from '../../types/index.js'
import { prisma } from '../../prisma/client.js'
import { register } from './conversations/register-conversation.js'
import { isPrivateChat } from '../../helpers/filters.js'
export { register } from './conversations/register-conversation.js'

export async function authentication(ctx: PretikContext, next: NextFunction) {
  const userId = ctx.from?.id

  if (!userId || _isUserAuthorized(ctx.session.auth)) {
    return await next()
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { employeeData: true },
  })

  if (user) {
    ctx.session.auth = { user: user }
    return await next()
  }

  if (isPrivateChat(ctx)) {
    return await ctx.conversation.enter(register.name)
  }

  await ctx.reply('Напиши боту в особисті, щоб зараєструватися')
}

function _isUserAuthorized(
  authSessionData: PretikContext['session']['auth']
): boolean {
  const isUserAuthorized = !!authSessionData

  return isUserAuthorized
}
