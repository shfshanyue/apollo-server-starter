import { ProjectConfig } from './type';
import { Model, BuildOptions, Sequelize, Options } from 'sequelize'
import * as utils from './src/utils'

type FindModel = typeof Model & {
  new (values?: object, options?: BuildOptions): typeof Model;
}

export type Models = {
  [key: string]: FindModel
}

export interface ProjectConfig {
  salt: string
}

export type AppConfig = {
  pg: {
    dialect: string,
    port: string,
    host: string,
    username: string
  }
} & ProjectConfig

export interface AppContext {
  sequelize: Sequelize,
  models: Models,
  config: AppConfig,
  utils: typeof utils
}
