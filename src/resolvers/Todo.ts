import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'

const typeDef = gql`
  enum TodoStatus {
    DONE 
    UNDO
  }

  type Todo @sql {
    id: ID!
    name: String!
    status: TodoStatus!
    createTime: DateTime!
    user: User! @sql(dep: ["userId"]) @findOption
  }

  extend type Query {
    todos: [Todo!]
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
    user (todo, {}, {}, { attributes }: any) {
      return todo.$get('user', {
        attributes
      })
    }
  },
  Query: {
  }
}

export {
  typeDef,
  resolver
}