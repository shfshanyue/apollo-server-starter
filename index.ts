import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import { formatError } from './lib/error'
import { typeDefs, resolvers } from './src'
import directives from './src/directives'
import * as utils from './src/utils'
import sequelize from './db'
import config from './config'
import { AppContext, Models } from './type'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context (): AppContext {
    return {
      sequelize,
      models: <Models>sequelize.models,
      config,
      utils
    }
  },
  formatError,
  schemaDirectives: directives,
  rootValue: {},
  playground: true,
  tracing: true
})

const app = new Koa();
server.applyMiddleware({ app });

const port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`),
)
