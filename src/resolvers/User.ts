import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'

const typeDef = gql`
  type User @sql(table: "users") {
    id: ID!
    name: String!
    email: String!
    createTime: DateTime! @sql(col: "create_time")
    todos: [Todo!]
  }

  extend type Query {
    users: [User!] @findOption
  }

  extend type Mutation {
    createUser: User!
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
  },
  Query: {
    users ({}, {}, { models }, { attributes }: any) {
      return models.users.findAll({
        attributes
      })
    }
  },
  Mutation: {
    createUser ({}, { name, email, password }, { models, utils, config }) {
      return models.users.create({
        name,
        email,
        password: utils.hash(password, config.salt)
      })
    }
  }
}

export {
  typeDef,
  resolver
}