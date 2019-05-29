// 写入 config.json 以及 db.json 文件

import Bluebird from 'bluebird'
import _ from 'lodash'
import fs from 'fs'
import { getValueByKey } from '../lib/consul'

import consulConfig from '../config/consul'
import projectConfig from '../config/project'

const CONFIG_FILE_PATH = `${__dirname}/../config/config.json`
const DB_CONFIG_FILE_PATH = `${__dirname}/../config/db.json`

const DB = 'todos'

Bluebird.map([...consulConfig.dependencies, consulConfig.project], async key => {
  const config = await getValueByKey(key)
  return key === projectConfig ? { ...projectConfig, ...config[consulConfig.project]} : config
}).then(configs => {
  const cfg = _.assign({}, ...configs)
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(cfg, null, 2), 'utf8')

  const dbCfg = {
    username: cfg.pg.username,
    password: cfg.pg.password,
    database: DB,
    host: cfg.pg.host,
    port: cfg.pg.port,
    dialect: 'postgres'
  }
  fs.writeFileSync(DB_CONFIG_FILE_PATH, JSON.stringify(dbCfg, null, 2), 'utf8')
})