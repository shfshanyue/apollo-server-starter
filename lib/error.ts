import { ApolloError } from 'apollo-server-koa'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BaseError, UniqueConstraintError } from 'sequelize'
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

function isApolloError (error: any): error is ApolloError {
  return error instanceof ApolloError
}

function isError (error: any): error is Error {
  return error instanceof Error
}

export function formatError (error: GraphQLError): GraphQLFormattedError {
  let code: string = _.get(error, 'extensions.code', 'BAD_REQUEST')
  let info: any = {}

  const originalError: any = error.originalError
  if (isAxiosError(originalError)) {
    code = `Request${originalError.code}`
  } else if (isJoiValidationError(originalError)) {
    code = 'JoiValidationError'
    info = originalError.details
  } else if (isSequelizeError(originalError)) {
    code = originalError.name
    if (isUniqueConstraintError(originalError)) {
      info = originalError.fields
    }
  } else if (isApolloError(originalError)){
    code = originalError.code
  } else if (isError(originalError)) {
    code = _.get(originalError, 'code', originalError.name)
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
