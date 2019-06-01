import { gql } from 'apollo-server-koa'

const typeDef = gql`
  directive @sql(
    table: String,
    dep: [String],
    col: String,
  ) on FIELD_DEFINITION | OBJECT

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