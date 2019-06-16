import { Sequelize } from 'sequelize-typescript'
import * as models from './models'

const { createContext } = require('dataloader-sequelize')

const config = require('../config/db.json')
const sequelize = new Sequelize({
  ...config,
  define: {
    timestamps: false,
    underscored: true
  },
  logging (sql, timing: any) {
    console.log(sql, timing)
  }
})

sequelize.addModels(Object.values(models))

createContext(sequelize, {
  cache: true
})

export default sequelize
export { models }