import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BaseError } from 'Sequelize'
import _ from 'lodash'
import { AxiosError } from 'axios'
import { typeDefs, resolvers } from './src'
import directives from './src/directives'
import * as utils from './src/utils'
import sequelize from './db'
import config from './config'
import { AppContext, Models } from './type'

const isProduction = process.env.NODE_ENV === 'production'

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
  formatError (error: GraphQLError): GraphQLFormattedError {
    let code: string = _.get(error, 'extensions.code', 'BAD_REQUEST')

    const originalError = error.originalError
    if ((originalError as AxiosError).isAxiosError) {
      code = `Axios-(originalError as AxiosError).code` || code
    } else if (originalError instanceof BaseError) {
      code = originalError.name
    } else {
      code = _.get(originalError, 'code', code)
    }

    if (!isProduction) {
      console.error(error)
    }
    return {
      ...error,
      extensions: isProduction ? { code } : {
        ..._.get(error, 'extensions', {}),
        code
      }
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
