import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import { typeDefs, resolvers } from './src'
import directives from './src/directives'
import sequelize from './db'
import config from './config'
import { GraphqlContext, Models } from './type'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context (): GraphqlContext {
    return {
      sequelize,
      models: <Models>sequelize.models,
      config
    }
  },
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
