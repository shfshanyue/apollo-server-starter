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
    user: User!
  }

  extend type Query {
    todos: [Todo!]
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
    user (todo) {
      return todo.$get('user')
    }
  },
  Query: {
  }
}

export {
  typeDef,
  resolver
}