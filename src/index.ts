import { AppContext } from './../type'
import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import { DocumentNode } from 'graphql'
import { IResolvers } from 'graphql-tools'

import { typeDef as scalarTypeDefs, resolver as scalarResovers } from './scalars'

interface Resolver {
  typeDefs: DocumentNode[],
  resolvers: IResolvers<any, AppContext>
}

const initResolver: Resolver = {
  typeDefs: [scalarTypeDefs],
  resolvers: {
    ...scalarResovers
  }
}

const schemaFiles: string[] = fs.readdirSync(path.resolve(__dirname, 'resolvers'))
const { typeDefs, resolvers } = schemaFiles.reduce(({ typeDefs, resolvers }, file) => {
  const { resolver, typeDef } = require(`./resolvers/${file}`)
  return {
    typeDefs: [...typeDefs, typeDef],
    resolvers: _.merge(resolvers, resolver)
  }
}, initResolver)

export {
  typeDefs,
  resolvers
}
