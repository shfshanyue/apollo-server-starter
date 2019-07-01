import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { formatError, Exception } from './lib/error'
import { apiLogger } from './lib/logger'
import { typeDefs, resolvers } from './src'
import directives from './src/directives'
import * as utils from './src/utils'
import sequelize, { models } from './db'
import config from './config'
import { AppContext, KoaContext } from './type'
import { auth, sentry } from './middlewares'

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
      Exception,
      user: ctx.user
    }
  },
  formatError,
  formatResponse (response: any) {
    apiLogger.info('Response', {
      response
    })
  },
  schemaDirectives: directives,
  rootValue: {},
  playground: true,
  tracing: true
})

const app = new Koa()
app.use(bodyParser())
app.use(auth)
app.use(sentry)
server.applyMiddleware({ app })

const port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`),
)
