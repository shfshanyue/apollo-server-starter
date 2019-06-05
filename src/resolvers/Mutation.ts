import { gql, IResolverObject } from 'apollo-server-koa'
import { AppContext } from './../../type'

const typeDef = gql`
  type Mutation {
    hello: String
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Mutation: {
    hello () {
      return 'hello, world'
    }
  }
}

export {
  typeDef,
  resolver
}