import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';

interface Resolver {
  typeDefs: DocumentNode[],
  resolvers: IResolvers
}

const initResolver: Resolver = {
  typeDefs: [],
  resolvers: {}
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