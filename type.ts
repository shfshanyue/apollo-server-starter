import { Exception } from './lib/error'
import { Sequelize } from 'sequelize-typescript'
import { ParameterizedContext } from 'koa'
import { ProjectConfig } from './type'
import * as utils from './src/utils'
import { models } from './db'
import { IResolverObject } from 'graphql-tools'

export interface Dictionary<T> {
  [index: string]: T;
}

export interface NumericDictionary<T> {
  [index: number]: T;
}

export type Many<T> = T | Readonly<T[]>;

export type Models = typeof models;

export interface ProjectConfig {
  salt: string;
  jwtSecret: string;
  sentryDSN: string;
}

export type AppConfig = {
  pg: {
    dialect: string;
    port: string;
    host: string;
    username: string;
  }
} & ProjectConfig;

export type UserRole = 'ADMIN' | 'USER';

export interface UserContext {
  id: number;
  role: UserRole;
};

export interface AppContext {
  sequelize: Sequelize;
  models: Models;
  config: AppConfig;
  utils: typeof utils;
  user?: UserContext;
  Exception: typeof Exception;
};

export interface KoaContext extends ParameterizedContext {
  user?: UserContext;
  requestId: string;
};

type ResolverModel<T> = IResolverObject<T, Required<AppContext>>

export type SequelizeResolverObject = {
  // [key in keyof typeof models]?: IResolverObject<models[key], AppContext>
  User?: ResolverModel<models.User>;
  Todo?: ResolverModel<models.Todo>;
} & IResolverObject<any, Required<AppContext>>
