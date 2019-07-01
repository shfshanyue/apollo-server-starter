import Redis from 'ioredis'
import { redisLogger } from './logger'
import config from '../config'

const redis = new Redis({
  host: config.redis.host,
  password: config.redis.password
})

const { sendCommand } = Redis.prototype
Redis.prototype.sendCommand = async function (...options: any[]) {
  const response = await sendCommand.call(this, ...options);
  redisLogger.info(options[0].name, {
    ...options,
    response
  })
  return response
}

module.exports = redis
