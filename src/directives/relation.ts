import { SchemaDirectiveVisitor } from 'graphql-tools'
import { GraphQLField } from 'graphql'
import { AppContext } from './../../type'

import _ from 'lodash'
import { Model } from 'sequelize-typescript'

class RelationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field: GraphQLField<Model, AppContext> & { col?: string, dep?: string[] }) {
    const { order } = this.args
    const name = field.name

    field.resolve = async (root, args, ctx, info) => {
      if (_.get(root, name)) {
        return _.get(root, name)
      }
      const { models, utils, contextOption } = ctx

      const sourceModel = root.constructor as typeof Model
      const association = sourceModel.associations[name]

      // 如果是 1:m 需要1的外键
      let foreignKey
      if (association.associationType === 'HasMany') {
        foreignKey = association.foreignKey
      }

      const attrs = utils.getModelAttrs(info, models)

      // 添加外键，方便 dataloader
      const attributes = attrs && foreignKey ? _.uniq([...attrs, foreignKey]) : attrs
      const { page, pageSize } = args
      const { limit, offset } = utils.parsePage(page, pageSize)
      return root.$get(name as any, {
        attributes,
        order,
        limit,
        offset,
        ...contextOption
      })
    }
  }
}

export default RelationDirective

