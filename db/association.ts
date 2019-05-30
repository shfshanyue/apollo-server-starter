import { Sequelize, Model, BuildOptions } from 'sequelize'

type FindModel = typeof Model & {
  new (values?: object, options?: BuildOptions): typeof Model;
}

type Models = {
  [key: string]: FindModel
}

export default function (sequelize: Sequelize) {
  const models = sequelize.models as Models

  models.users.hasMany(models.todo, { foreignKey: 'user_id', as: 'todos' })
  models.todo.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' })
}
