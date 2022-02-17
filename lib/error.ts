import { ApolloError } from 'apollo-server-koa'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BaseError, UniqueConstraintError } from 'sequelize'
import _ from 'lodash'
import { AxiosError } from 'axios'
import Joi from 'joi'
import  { Sentry } from './sentry'
import { Severity } from '@sentry/node'

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

const enum APP_ERROR_CODE {
  // 如果 code 为 BadRequest, 则客户端可以直接展示 message
  BadRequest
}

export class Exception extends ApolloError {
  constructor (message: string, code: keyof typeof APP_ERROR_CODE = 'BadRequest', properties: Record<string, any> = {}) {
    super(message, `App${code}`, {
      level: Severity.Warning,
      ...properties
    })
  }
}

export function formatError (error: GraphQLError): GraphQLFormattedError {
  let code: string = _.get(error, 'extensions.code', 'Error')
  let info: any
  let level = Severity.Error

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
      level = Severity.Warning
    }
  } else if (isApolloError(originalError)){
    level = originalError.level || Severity.Warning
  } else if (isError(originalError)) {
    code = _.get(originalError, 'code', originalError.name)
    level = Severity.Fatal
  }

  const formatError = {
    ...error,
    extensions: {
      ..._.get(error, 'extensions', {}),
      code,
      info
    }
  }
  Sentry.withScope(scope => {
    scope.setTag('code', code)
    scope.setLevel(level)
    scope.setExtras(formatError)
    Sentry.captureException(originalError || error)
  })
  if (!isProduction) {
    // if in dev, print formatError
    console.error(formatError)
  }
  return {
    ...error,
    extensions: isProduction ? { code, info } : formatError.extensions
  }
}
