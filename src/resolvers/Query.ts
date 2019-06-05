import { gql, ApolloError, IResolverObject } from 'apollo-server-koa'
import axios from 'axios'
import fs from 'fs'
import { AppContext } from './../../type'

const typeDef = gql`
  directive @sql(
    table: String
    dep: [String]
    col: String
  ) on FIELD_DEFINITION | OBJECT

  directive @findOption(
    page: Int
    pageSize: Int
  ) on FIELD_DEFINITION

  type Query {
    hello: String

    graphqlError: Int
    reqError: Int
    dbError: Int
    readError: Int
    apolloError: Int
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Query: {
    hello () {
      return 'hello, world'
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
    apolloError () {
      return new ApolloError('ApolloError', undefined, {
        a: 3,
        b: 4
      })
    },
    dbError ({}, {}, { models }) {
      return models.todo.count({
        where: {
          a: 3
        }
      })
    }
  }
}

export {
  typeDef,
  resolver
}