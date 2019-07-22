import { Sequelize } from 'sequelize-typescript'
import _ from 'lodash'
import { dbLogger } from '../lib/logger'
import * as models from './models'

const { createContext } = require('dataloader-sequelize')

const config = require('../config/db.json')
const sequelize = new Sequelize({
  ...config,
  define: {
    timestamps: false,
    underscored: true
  },
  logging (sql, timing) {
    dbLogger.info(sql, _.isObject(timing) ? timing : { timing })
  }
})

sequelize.addModels(Object.values(models))

createContext(sequelize, {
  cache: true
})

export default sequelize
export { models }
