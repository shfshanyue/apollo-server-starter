import { ProjectConfig } from './../type'

const config: ProjectConfig = {
  salt: 'hello, world',
  jwtSecret: 'only in local debug',

  // you could get it through sentry.io
  sentryDSN: 'https://14f249998e234949820a1e24949bdddb@sentry.io/1489452'
}

export default config
