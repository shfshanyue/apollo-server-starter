import { SchemaDirectiveVisitor } from "graphql-tools"
import { GraphQLField, defaultFieldResolver } from "graphql"
import { AuthenticationError, ForbiddenError } from 'apollo-server-koa'
import { AppContext, UserRole } from "../../type"

class AuthDirective extends SchemaDirectiveVisitor {
  public readonly args: {
    // role 为 undefined，代表所有角色的用户都有权限访问
    roles?: UserRole[]
  }

  visitFieldDefinition (field: GraphQLField<any, AppContext>) {
    const { resolve = defaultFieldResolver } = field
    const { roles } = this.args
    // const roles: UserRole[] = ['USER', 'ADMIN']
    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user) {
        throw new AuthenticationError('Unauthorized')
      }
      if (roles && !roles.includes(ctx.user.role)) {
        throw new ForbiddenError('Forbidden')
      }
      return resolve.call(this, root, args, ctx, info)
    }
  }
}

export default AuthDirective