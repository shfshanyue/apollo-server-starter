import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'
import * as Joi from '@hapi/joi'

const typeDef = gql`
  type User @sql {
    id: ID!
    name: String!
    email: String!
    createTime: DateTime!
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
    async users ({}, {}, { models }, { attributes }: any) {
      const u = await models.User.findAll({
        attributes
      })
      return u
    }
  },
  Mutation: {
    createUser ({}, { name, email, password }, { models, utils, config }) {
      // 有的格式前端需要做预校验，不需要返回 machine readable 的 fields
      Joi.assert(email, Joi.string().email())
      return models.User.create({
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