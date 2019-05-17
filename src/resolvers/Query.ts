import { DocumentNode } from 'graphql'
import { gql } from 'apollo-server-koa'

const typeDef: DocumentNode = gql`
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