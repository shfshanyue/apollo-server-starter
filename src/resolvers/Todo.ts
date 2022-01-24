import { AppResolvers } from './../../type'
import { gql } from 'apollo-server-koa'

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

const resolver: AppResolvers = {
  Todo: {
    user (todo, {}, { contextOption }, { attributes }: any) {
      return todo.$get('user', {
        attributes,
        ...contextOption
      })
    }
  },
  Query: {
    todo ({}, { id }, { models, contextOption }, { attributes }: any) {
      return models.Todo.findByPk(id, {
        attributes,
        ...contextOption
      })
    },
    todos ({}, {}, { models, contextOption }, { attributes }: any) {
      return models.Todo.findAll({
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
