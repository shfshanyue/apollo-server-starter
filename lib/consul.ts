import _ from 'lodash'
import Consul from 'consul'
import { host, port } from '../config/consul'

export const consul = Consul({
  promisify: true,
  host,
  port
})

export async function getValueByKey (key: string): Promise<any> {
  const values = await consul.kv.get<any[]>({
    key,
    recurse: true
  })
  return values.reduce((acc, value) => {
    const { Key: k, Value: v } = value
    if (!_.endsWith(k, '/')) {
      _.set(acc, k.replace(/\//g, '.'), v)
    }
    return acc
  }, {})
}
