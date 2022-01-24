import { gql } from 'apollo-server-koa'
import { AppResolvers } from './../../type'

const typeDef = gql`
  type Mutation {
    hello: String
  }
`

const resolver: AppResolvers = {
  Mutation: {
    hello () {
      return 'hello, world'
    }
  }
}

export {
  typeDef,
  resolver
}
