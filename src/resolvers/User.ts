import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'
import * as Joi from '@hapi/joi'

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
    createUser(
      name: String!
      email: String!
      password: String!
    ): User!
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
      // 有的格式前端需要做预校验，不需要返回 machine readable 的 fields
      Joi.assert(email, Joi.string().email())
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