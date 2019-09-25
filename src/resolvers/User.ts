import { gql } from 'apollo-server-koa'
import * as Joi from '@hapi/joi'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { SequelizeResolverObject } from './../../type'

const typeDef = gql`
  type User @sql {
    id: ID!
    name: String!
    email: String!
    createTime: DateTime!
    todos (
      page: Int = 1
      pageSize: Int = 10
    ): [Todo!] @relation
  }

  extend type Query {
    users (
      page: Int = 1 
      pageSize: Int = 10
    ): [User!] @findOption
  }

  extend type Mutation {
    # 用户注册
    createUser(
      name: String!
      email: String!
      password: String!
    ): User!

    # 用户登录，如果返回 null，代表登录失败
    createUserToken(
      email: String!
      password: String!
    ): String

    updateUserToken: String! @auth
  }
`

const resolver: SequelizeResolverObject = {
  Query: {
    users ({}, {}, { models }, { attributes, limit, offset }: any) {
      return models.User.findAll({
        attributes,
        limit,
        offset
      })
    }
  },
  Mutation: {
    createUser ({}, { name, email, password }, { models, utils }) {
      // 有的格式前端需要做预校验，不需要返回 machine readable 的 fields
      Joi.assert(email, Joi.string().email())
      return models.User.create({
        name,
        email,
        password: utils.hash(password)
      })
    },
    async createUserToken ({}, { email, password }, { models, utils, config }) {
      const user = await models.User.findOne({
        where: {
          email,
          password: utils.hash(password)
        },
        attributes: ['id', 'role'],
        raw: true
      })
      if (!user) {
        return
      }
      return jwt.sign(user, config.jwtSecret, { expiresIn: '7d' })
    },
    async updateUserToken ({}, {}, { user, config }) {
      return jwt.sign(_.pick(user, ['id', 'role']), config.jwtSecret, { expiresIn: '7d' })
    }
  }
}

export {
  typeDef,
  resolver
}
