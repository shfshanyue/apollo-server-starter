import { gql, ForbiddenError } from 'apollo-server-koa'
import axios from 'axios'
import fs from 'fs'
import { AppContext } from './../../type'
import { IExecutableSchemaDefinition } from '@graphql-tools/schema'

const typeDef = gql`
  directive @sql(
    table: String
    dep: [String]
    col: String
  ) on FIELD_DEFINITION | OBJECT

  directive @findOption on FIELD_DEFINITION
  directive @relation on FIELD_DEFINITION

  directive @auth(
    roles: [String]
  ) on FIELD_DEFINITION

  type Query {
    hello: String

    graphqlError: Int!
    reqError: Int
    dbError: Int
    readError: Int
    exception: Int
    typeError: Int
    cache: Int

    authInfo: Int @auth
    forbidden: Int
  }
`

const resolver: IExecutableSchemaDefinition<AppContext>['resolvers'] = {
  Query: {
    hello () {
      return 'hello, world'
    },
    cache ({}, {}, { redis }) {
      return redis.get('hello')
    },
    typeError () {
      const o: any = undefined
      return o.a
    },
    graphqlError () {},
    reqError () {
      return axios.get('http://localhost:8080', {
        params: {
          a: 3,
          b: 4
        }
      })
    },
    readError () {
      fs.readFileSync('/does/not/exist');
    },
    exception ({}, {}, { Exception }) {
      return new Exception('Exception', undefined, { a: 3 })
    },
    dbError ({}, {}, { models }) {
      return models.User.count({
        where: {
          a: 3
        }
      })
    },
    authInfo () {
      return 10
    },
    forbidden () {
      throw new ForbiddenError('Forbidden test')
    }
  }
}

export {
  typeDef,
  resolver
}
