import jwt from 'jsonwebtoken'
import { UserContext, KoaContext } from '../type'
import config from '../config'

function getUser (token: string): UserContext | undefined {
  try {
    const who = jwt.verify(token, config.jwtSecret)
    return who as UserContext
  } catch (e) {
    return
  }
}

export async function auth (ctx: KoaContext, next: any) {
  const token = ctx.header['authorization'] || ''
  ctx.user = getUser(token)
  await next()
}
