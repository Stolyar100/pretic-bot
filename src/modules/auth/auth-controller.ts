import { env, loadEnv } from '../../config/env.js'
loadEnv()
import { Filter, NextFunction } from 'grammy'
import { PretikContext } from '../../types/index.js'
import { prisma } from '../../prisma/client.js'
import { register } from './conversations/register-conversation.js'
export { register } from './conversations/register-conversation.js'

const { ADMIN_TAB_NUMBER } = env

export async function authentication(ctx: PretikContext, next: NextFunction) {
  const userId = ctx.from?.id

  if (!userId || _isUserAuthorized(ctx.session.auth)) {
    return await next()
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { employeeData: true },
  })

  if (!user) {
    await ctx.conversation.enter(register.name)
    return
  }

  ctx.session.auth = { user: user, isAdmin: _isAdmin(user.employeeTabNumber) }
  await next()
}

function _isUserAuthorized(
  authSessionData: PretikContext['session']['auth']
): boolean {
  const isUserAuthorized = !!authSessionData

  return isUserAuthorized
}

function _isAdmin(tabNumber: string): boolean {
  const isAdmin = tabNumber == ADMIN_TAB_NUMBER
  return isAdmin
}
