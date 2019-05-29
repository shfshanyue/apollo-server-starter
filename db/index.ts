import { Sequelize } from 'sequelize'
import fs from 'fs'

const { createContext } = require('dataloader-sequelize')

const config = require('../config/db.json')
const sequelize = new Sequelize(config)

// import all schemas
fs.readdirSync(`${__dirname}/_schemas`).forEach((file) => {
  sequelize.import(`${__dirname}/_schemas/${file}`)
})

// association(sequelize)
createContext(sequelize, {
  cache: true
})

export default sequelize
