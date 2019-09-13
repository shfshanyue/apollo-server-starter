// write to config.json and db.json

import Bluebird from 'bluebird'
import _ from 'lodash'
import fs from 'fs'
import { get } from '../lib/consul'

import { project, dependencies } from '../config/consul'
import projectConfig from '../config/project'

const CONFIG_FILE_PATH = `${__dirname}/../config/config.json`
const DB_CONFIG_FILE_PATH = `${__dirname}/../config/db.json`

Bluebird.map([...dependencies, project], async keys => {
  keys = Array.isArray(keys) ? keys : [keys]
  const [key, alias = key] = keys
  const config = await get(key)
  return key === project ? { ...projectConfig, ...config[project]} : { [alias]: config[key] }
}).then(configs => {
  const cfg = _.assign({}, ...configs)
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(cfg, null, 2), 'utf8')

  const dbCfg = {
    username: cfg.db.username,
    password: cfg.db.password,
    database: cfg.db.database,
    host: cfg.db.host,
    port: cfg.db.port,
    dialect: 'postgres'
  }
  fs.writeFileSync(DB_CONFIG_FILE_PATH, JSON.stringify(dbCfg, null, 2), 'utf8')
})