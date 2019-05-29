import rimraf from 'rimraf'

const SequelizeAuto = require('sequelize-auto')

const SCHEMA_PATH = `${__dirname}/../db/_schemas`
const db = require('../config/db.json')

rimraf(SCHEMA_PATH, () => {
  console.log('delete schema path DONE!')
})

const auto = new SequelizeAuto(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  port: db.port,
  additional: {
    timestamps: false
  },
  spaces: true,
  indentation: 2,
  directory: SCHEMA_PATH
})

auto.run((err: Error) => {
  if (err) {
    throw err
  }
  console.log('sync database DONE!')
  process.exit(0)
})
