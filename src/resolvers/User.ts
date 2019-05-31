import { GraphqlContext } from './../../type'
import { gql } from 'apollo-server-koa'

const typeDef = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    todos: [Todo!]
  }

  extend type Query {
    users: [User!]
  }
`

const resolver = {
  Todo: {
  },
  Query: {
    users ({}, {}, { models }: GraphqlContext) {
      return models.users.findAll()
    }
  }
}

export {
  typeDef,
  resolver
}