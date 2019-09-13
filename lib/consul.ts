import _ from 'lodash'
import Consul from 'consul'
import { host, port } from '../config/consul'

function parse (s: string) {
  try {
    return JSON.parse(s)
  } catch {
    return s
  }
}

export const consul = Consul({
  promisify: true,
  host,
  port
})

/**
 * @param  {string} key redis
 * @returns Promise { redis: { port: 6379, host: 'redis.xiange.tech' }}
 */
export async function get (key: string): Promise<Record<string, any>> {
  const values = await consul.kv.get<any[]>({
    key,
    recurse: true
  })
  return values.reduce((acc, value) => {
    const { Key: k, Value: v } = value
    if (!_.endsWith(k, '/')) {
      _.set(acc, k.replace(/\//g, '.'), parse(v))
    }
    return acc
  }, {})
}
