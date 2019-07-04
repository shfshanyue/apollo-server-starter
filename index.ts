import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import _ from 'lodash'
import { formatError, Exception, apiLogger, session, redis } from './lib'
import { typeDefs, resolvers } from './src'
import directives from './src/directives'
import * as utils from './src/utils'
import sequelize, { models } from './db'
import config from './config'
import { AppContext, KoaContext } from './type'
import { auth, context } from './middlewares'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context ({ ctx }: { ctx: KoaContext }): AppContext {
    apiLogger.info('Request', {
      request: ctx.request,
      user: ctx.user
    })
    return {
      sequelize,
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
    apiLogger.info('Response', {
      response: {
        data: response.data
      },
      duration: _.get(response, 'extensions.tracing.duration', 0) / 1000000
    })
  },
  schemaDirectives: directives,
  rootValue: {},
  playground: true,
  tracing: true
})

const app = new Koa()
app.use(async ({}, next) => {
  await session.runPromise(() => {
    return next()
  })
})
app.use(bodyParser())
app.use(auth)
app.use(context)
server.applyMiddleware({ app })

const port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`),
)
