import { SequelizeOptions } from 'sequelize-typescript'
import { RedisOptions } from 'ioredis'

import { config as env } from 'dotenv'

env()

interface AppConfig {
  salt: string;
  jwtSecret: string;
  sentryDSN: string;
  db: SequelizeOptions;
  redis: RedisOptions;
};

const config: AppConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  },
  db: {
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT as any,
    username: process.env.DB_USERNAME
  },
  salt: process.env.SALT!,
  jwtSecret: process.env.JWT_SECRET!,
  sentryDSN: process.env.SENTRY_DSN!
}

export default config
