import Sentry from '@sentry/node'
import config from '../config'

const debug = process.env.NODE_ENV !== 'production'

Sentry.init({
  dsn: config.sentryDSN,
  debug,
  environment: process.env.NODE_ENV || 'development',
  beforeSend () {
    return null 
  }
})

export default Sentry
