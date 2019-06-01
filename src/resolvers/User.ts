import { GraphqlContext } from './../../type'
import { gql } from 'apollo-server-koa'

import { getModelAttrs } from '../utils'

const typeDef = gql`
  type User @sql(table: "users") {
    id: ID!
    name: String!
    email: String!
    createTime: DateTime! @sql(col: "create_time")
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
    users ({}, {}, { models }: GraphqlContext, info: any) {
      const attributes = getModelAttrs(info, models)
      return models.users.findAll({
        attributes
      })
    }
  }
}

export {
  typeDef,
  resolver
}