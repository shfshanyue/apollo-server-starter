import { ProjectConfig } from './type';
import { Model, BuildOptions, Sequelize, Options } from 'sequelize'
import * as utils from './src/utils'

export interface Dictionary<T> {
  [index: string]: T;
}

export interface NumericDictionary<T> {
  [index: number]: T;
}

export type Many<T> = T | Readonly<T[]>;

export type BaseModel = typeof Model & {
  new (values?: object, options?: BuildOptions): typeof Model;
}

export type Models = Dictionary<BaseModel>

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
