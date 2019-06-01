import { gql } from 'apollo-server-koa'

const typeDef = gql`
  directive @sql(
    table: String,
    dep: [String],
    col: String,
  ) on FIELD_DEFINITION | OBJECT

  directive @findOption(
    page: Int,
    pageSize: Int
  ) on FIELD_DEFINITION

  type Query {
    hello: String
  }
`

const resolver = {
  Query: {
    hello () {
      return 'hello, world'
    }
  }
}

export {
  typeDef,
  resolver
}