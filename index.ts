import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import { typeDefs, resolvers } from './src'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  tracing: true
})

const app = new Koa();
server.applyMiddleware({ app });

const port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`),
)
