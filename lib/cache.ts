import LRU from 'lru-cache'

export const cache = new LRU({
  max: 500,
  maxAge: 10 * 1000
})
