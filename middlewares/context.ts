import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { Sentry } from '../lib/sentry'
import { session } from '../lib/session'
import { KoaContext } from '../type'

// Sentry Context && Tracing
export async function context (ctx: KoaContext, next: any) {
  Sentry.configureScope(scope => {
    scope.clear()
    ctx.user && scope.setUser({
      ...ctx.user,
      token: ctx.header['authorization']
    } as any)
    scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request as any))
    const requestId = ctx.header['x-request-id'] || uuid()
    ctx.requestId = requestId as any
    ctx.res.setHeader('X-Request-ID', requestId)
    session.set('requestId', requestId)
    scope.setTags(_.pickBy({
      requestId,
      query: _.get(ctx.request.body, 'operationName')
    }))
  })
  await next()
}
