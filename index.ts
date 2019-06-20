import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import { formatError, Exception } from './lib/error'
import { typeDefs, resolvers } from './src'
import directives from './src/directives'
import * as utils from './src/utils'
import sequelize, { models } from './db'
import config from './config'
import { AppContext, KoaContext } from './type'
import { auth } from './middlewares'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context ({ ctx }: { ctx: KoaContext }): AppContext {
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
  schemaDirectives: directives,
  rootValue: {},
  playground: true,
  tracing: true
})

const app = new Koa()
app.use(auth)

server.applyMiddleware({ app })

const port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`),
)
