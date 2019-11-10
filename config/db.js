// 被 sequelize-cli 使用

module.exports = {
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_DIALECT,
  username: process.env.DB_USERNAME
}
