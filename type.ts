import { Sequelize } from 'sequelize-typescript'
import { ParameterizedContext } from 'koa'
import { IResolverObject } from 'graphql-tools'
import { Redis } from 'ioredis'
import { ProjectConfig } from './type'
import * as utils from './src/utils'
import { Exception } from './lib/error'
import { models } from './db'

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
    password: string;
  },
  redis: {
    port: string;
    host: string;
    password: string;
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
  redis: Redis;
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
