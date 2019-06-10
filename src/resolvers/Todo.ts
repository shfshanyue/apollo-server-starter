import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'

const typeDef = gql`
  enum TodoStatus {
    DONE 
    UNDO
  }

  type Todo {
    id: ID!
    name: String!
    status: TodoStatus!
    createTime: DateTime!
  }

  extend type Query {
    todos: [Todo!]
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
  },
  Query: {
  }
}

export {
  typeDef,
  resolver
}