// project config (todo) in consul will merge with config/project.ts
export const project = 'todo'

// project dep config in consul
// [pg, db] -> key: pg, alias: db
export const dependencies = ['redis', ['pg', 'db']]

// consol host config
export const host = '172.18.0.1'
export const port = '8500'
