import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BaseError } from 'Sequelize'
import _ from 'lodash'
import { AxiosError } from 'axios'

const isProduction = process.env.NODE_ENV === 'production'

export function formatError (error: GraphQLError): GraphQLFormattedError {
  let code: string = _.get(error, 'extensions.code', 'BAD_REQUEST')

  const originalError = error.originalError
  if ((originalError as AxiosError).isAxiosError) {
    code = `Axios-(originalError as AxiosError).code` || code
  } else if (originalError instanceof BaseError) {
    code = originalError.name
  } else {
    code = _.get(originalError, 'code', code)
  }

  if (!isProduction) {
    console.error(error)
  }
  return {
    ...error,
    extensions: isProduction ? { code } : {
      ..._.get(error, 'extensions', {}),
      code
    }
  }
}
