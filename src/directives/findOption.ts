import { SchemaDirectiveVisitor } from 'graphql-tools'
import { GraphQLField, defaultFieldResolver } from 'graphql'
import { AppContext } from './../../type'

class FindOptionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field: GraphQLField<any, AppContext> & { col?: string, dep?: string[] }) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root, args, ctx, info) => {
      const { utils, models } = ctx
      const attributes = utils.getModelAttrs(info, models)
      const { page, pageSize } = args
      const { limit, offset } = utils.parsePage(page, pageSize)
      return resolve.call(this, root, args, ctx, {
        ...info,
        attributes,
        limit,
        offset
      })
    }
  }
}

export default FindOptionDirective
