import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import _ from 'lodash'
// import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { RedisCache } from 'apollo-server-cache-redis'
import { formatError, Exception, responseLogger, queryLogger, session, redis } from './lib'
import { typeDefs, resolvers } from './src'
// import directives from './src/directives'
import * as utils from './src/utils'
import sequelize, { models, contextOption } from './db'
import config from './config'
import { AppContext, KoaContext } from './type'
import { auth, context } from './middlewares'
// import httpStatusPlugin from './src/plugin/httpStatus'

const cache = new RedisCache({
  host: config.redis.host,
  password: config.redis.password
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context ({ ctx }: { ctx: KoaContext }): AppContext {
    const body = ctx.request.body || {}
    queryLogger.info(body.query, {
      operationName: body.operationName,
      query: body.query,
      variables: body.variables,
      ip: ctx.request.ip,
      user: ctx.user
    })
    return {
      sequelize,
      contextOption,
      models,
      config,
      utils,
      redis,
      Exception,
      user: ctx.user
    }
  },
  formatError,
  formatResponse (response: any) {
    responseLogger.info('Response', {
      data: response.data,
      duration: _.get(response, 'extensions.tracing.duration', 0) / 1000000
    })
    return null
  },
  // cacheControl: {
  //   defaultMaxAge: 5
  // },
  // prefix with fqc
  cache,
  // prefix with apq
  persistedQueries: {
    cache
  },
  // plugins: [responseCachePlugin() as any, httpStatusPlugin],
  // schemaDirectives: directives,
  rootValue: {},
  // playground: true,
  // tracing: true,
})

const app = new Koa()
app.use(async ({}, next) => {
  // integreted with requestId
  await session.runPromise(() => {
    return next()
  })
})
app.use(auth)
app.use(context)
server.start().then(() => {
  server.applyMiddleware({
    app,
    onHealthCheck: async () => true,
    bodyParserConfig: true,
  })
})

const port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`),
)
