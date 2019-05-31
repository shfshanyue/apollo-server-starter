import { Model, BuildOptions, Sequelize } from 'sequelize'

type FindModel = typeof Model & {
  new (values?: object, options?: BuildOptions): typeof Model;
}

export type Models = {
  [key: string]: FindModel
}

export interface GraphqlContext {
  sequelize: Sequelize,
  models: Models,
  config: any,
}
