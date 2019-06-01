import { Model, BuildOptions, Sequelize } from 'sequelize'
import * as utils from './src/utils'

type FindModel = typeof Model & {
  new (values?: object, options?: BuildOptions): typeof Model;
}

export type Models = {
  [key: string]: FindModel
}

export interface GraphqlContext {
  sequelize: Sequelize,
  models: Models,
  config: {
    [key: string]: any
  },
  utils: typeof utils
}
