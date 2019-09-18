import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import _ from 'lodash'

const httpStatusPlugin: ApolloServerPlugin = {
  requestDidStart(): GraphQLRequestListener<any> {
    return {
      didEncounterErrors({ response, errors }) {
        const errorMap = _.keyBy(errors, 'extensions.code')
        if (errorMap['UNAUTHENTICATED']) {
          response!.http!.status = 401
          return
        }
        if (errorMap['FORBIDDEN']) {
          response!.http!.status = 403
          return
        }
        response!.http!.status = 400
      }
    }
  }
}

export default httpStatusPlugin
