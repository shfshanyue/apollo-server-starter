import { SchemaDirectiveVisitor } from 'graphql-tools'
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLObjectType
} from 'graphql'

class SqlDirective extends SchemaDirectiveVisitor {
  public readonly args: {
    table?: string,
    col?: string,
    dep?: [string]
  }

  public visitObject(object: GraphQLObjectType & { table?: string }) {
    object.table = this.args.table || object.name
  }

  public visitFieldDefinition(field: GraphQLField<any, any> & { col?: string, dep?: string[] }) {
    const { col, dep = [] } = this.args
    const { resolve = defaultFieldResolver } = field

    field.dep = col ? [...dep, col] : dep

    field.resolve = async (root, ...args) => {
      if (col) {
        return root[col]
      }
      return resolve.call(this, root, ...args)
    }
  }
}

export default SqlDirective
