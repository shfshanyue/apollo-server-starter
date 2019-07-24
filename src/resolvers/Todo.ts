import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'
import { contextOption } from '../../db'

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
    user: User! @sql(dep: ["userId"]) @relation
  }

  extend type Query {
    todos: [Todo!] @findOption
    todo (
      id: ID
    ): Todo @findOption
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
    user (todo, {}, {}, { attributes }: any) {
      return todo.$get('user', {
        attributes,
        ...contextOption
      })
    }
  },
  Query: {
    todo ({}, { id }, { models }, { attributes }: any) {
      return models.Todo.findByPk(id, {
        attributes,
        ...contextOption
      })
    }
  }
}

export {
  typeDef,
  resolver
}
