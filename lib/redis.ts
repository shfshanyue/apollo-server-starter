import Redis from 'ioredis'
import { redisLogger } from './logger'
import config from '../config'

const redis = new Redis(config.redis)

const { sendCommand } = Redis.prototype
Redis.prototype.sendCommand = async function (...options: any[]) {
  const response = await sendCommand.call(this, ...options);
  redisLogger.info(options[0].name, {
    ...options[0],
    response
  })
  return response
}

export { redis }
