import { gql } from 'apollo-server-koa'

const typeDef = gql`
  type Query {
    hello: String
  }
`

const resolver = {
  Query: {
    hello: () => 'Hello world!'
  }
}

export {
  typeDef,
  resolver
}