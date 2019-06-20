import { ProjectConfig } from './../type'

const config: ProjectConfig = {
  salt: 'hello, world',
  jwtSecret: 'only in local debug',
  sentryDSN: 'you need configure key/value in consul'
}

export default config
