import GraphQLJSON from 'graphql-type-json'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { gql } from 'apollo-server-koa'


const typeDef = gql`
  scalar JSON
  scalar DateTime
  scalar Date
  scalar Time
`

const resolver = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Time: GraphQLTime
}

export {
  typeDef,
  resolver
}
