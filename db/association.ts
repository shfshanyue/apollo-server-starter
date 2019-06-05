import { Sequelize } from 'Sequelize'
import { Models } from './../type'


export default function (sequelize: Sequelize) {
  const models = <Models>sequelize.models

  models.users.hasMany(models.todo, { foreignKey: 'user_id', as: 'todos' })
  models.todo.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' })
}
