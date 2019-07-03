import winston, { format } from 'winston'
import os from 'os'
import { session } from './session'

const requestId = format((info) => {
  info.requestId = session.get('requestId')
  return info
})

function createLogger (label: string) {
  return winston.createLogger({
    defaultMeta: {
      serverName: os.hostname,
      label
    },
    format: format.combine(
      format.timestamp(),
      requestId(),
      format.json()
    ),
    transports: [
      new winston.transports.File({
        dirname: './logs',
        filename: `${label}.log`,
      })
    ]
  })
}

export const apiLogger = createLogger('api')
export const dbLogger = createLogger('db')
export const redisLogger = createLogger('redis')
