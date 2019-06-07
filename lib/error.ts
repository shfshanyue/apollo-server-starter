import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BaseError, UniqueConstraintError } from 'Sequelize'
import _ from 'lodash'
import { AxiosError } from 'axios'
import Joi from '@hapi/joi'

const isProduction = process.env.NODE_ENV === 'production'

function isAxiosError (error: any): error is AxiosError {
  return error.isAxiosError
}

function isJoiValidationError (error: any): error is Joi.ValidationError {
  return error.isJoi
}

function isSequelizeError (error: any): error is BaseError {
  return error instanceof BaseError
}

function isUniqueConstraintError (error: any): error is UniqueConstraintError {
  return error instanceof UniqueConstraintError
}

export function formatError (error: GraphQLError): GraphQLFormattedError {
  let code: string = _.get(error, 'extensions.code', 'BAD_REQUEST')
  let info: any = {}

  const originalError = error.originalError
  if (isAxiosError(originalError)) {
    code = `Axios-${originalError.code}`
  } else if (isJoiValidationError(originalError)) {
    code = 'Joi-ValidationError'
    info = originalError.details
  } else if (isSequelizeError(originalError)) {
    code = originalError.name
    if (isUniqueConstraintError(originalError)) {
      info = originalError.fields
    }
  } else {
    code = _.get(originalError, 'code', code)
  }

  const formatError = {
    ...error,
    extensions: {
      ..._.get(error, 'extensions', {}),
      code,
      info
    }
  }
  if (!isProduction) {
    console.error(formatError)
  }
  return {
    ...error,
    extensions: isProduction ? { code, info } : formatError.extensions
  }
}
