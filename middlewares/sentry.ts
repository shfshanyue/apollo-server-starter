import _ from 'lodash'
import Sentry from '../lib/sentry'
import sequelize from '../db'
import { KoaContext } from '../type'

// CaptureException && Tracing
export async function sentry (ctx: KoaContext, next: any) {
  Sentry.configureScope(scope => {
    scope.clear()
    ctx.user && scope.setUser({
      ...ctx.user,
      token: ctx.header['authorization']
    } as any)
    scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request))
    const requestId = ctx.header['x-request-id'] || Math.random().toString(36).substr(2, 9)
    sequelize.options.logging = function (sql, timing: any) {
      console.log({
        ...timing,
        sql,
        requestId
      })
    }
    scope.setTags(_.pickBy({
      requestId,
      query: _.get(ctx.request.body, 'operationName')
    }))
  })
  await next()
}
