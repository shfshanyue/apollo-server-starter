import { GraphqlContext } from './../../type'
import { gql } from 'apollo-server-koa'

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

const resolver = {
  Todo: {
  },
  Query: {
    todos ({}, {}, { models }: GraphqlContext) {
      return models.todo.findAll()
    }
  }
}

export {
  typeDef,
  resolver
}