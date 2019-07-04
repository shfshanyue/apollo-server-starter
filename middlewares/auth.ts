import jwt from 'jsonwebtoken'
import moment from 'moment'
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
  if (ctx.user) {
    const exp = moment(ctx.user.exp * 1000)
    if (exp.diff(new Date(), 'day') < 3) {
      const token = jwt.sign(ctx.user, config.jwtSecret, { expiresIn: '7d' })
      ctx.res.setHeader('Token', token)
    }
  }
  await next()
}
