import { AppContext } from './../../type'
import { SchemaDirectiveVisitor } from 'graphql-tools'
import { GraphQLField, defaultFieldResolver } from 'graphql'

class FindOptionDirective extends SchemaDirectiveVisitor {
  public readonly args: {
    page?: number,
    pageSize?: number
  }

  visitFieldDefinition (field: GraphQLField<any, AppContext> & { col?: string, dep?: string[] }) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root, args, ctx, info) => {
      const { utils, models } = ctx
      const attributes = utils.getModelAttrs(info, models)
      const { page, pageSize } = this.args
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
