import fs from 'fs'
import _ from 'lodash'

const dbModel = `import { Table, Column, Model, AutoIncrement, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { ENUM } from 'sequelize'
import { User } from './User'

// import this in ./index.ts
// import this in ./index.ts
// import this in ./index.ts
@Table({
  tableName: 'todo'
})
export class Todo extends Model<Todo> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  createTime: Date;

  @Column(ENUM('UNDO', 'DONE'))
  status: 'UNDO' | 'DONE';

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User
}
`

const gqlSchema = `import { AppContext } from './../../type'
import { gql, IResolverObject } from 'apollo-server-koa'
import { contextOption } from '../../db'

const typeDef = gql\`
  enum TodoStatus {
    DONE 
    UNDO
  }

  type Todo @sql {
    id: ID!
    name: String!
    status: TodoStatus!
    createTime: DateTime!
    user: User! @sql(dep: ["userId"]) @relation
  }

  extend type Query {
    todos: [Todo!] @findOption
    todo (
      id: ID
    ): Todo @findOption
  }
\`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
    user (todo, {}, {}, { attributes }: any) {
      return todo.$get('user', {
        attributes,
        ...contextOption
      })
    }
  },
  Query: {
    todo ({}, { id }, { models }, { attributes }: any) {
      return models.Todo.findByPk(id, {
        attributes,
        ...contextOption
      })
    }
  }
}

export {
  typeDef,
  resolver
}
`

if (!process.argv[2]) {
  console.error('ERROR: You must provide a SCHEMA NAME')
  process.exit(1)
}

const name = _.upperFirst(process.argv[2])
const modelPath = `${__dirname}/../db/models/${name}.ts`
const schemaPath = `${__dirname}/../src/resolvers/${name}.ts`

if (fs.existsSync(modelPath) || fs.existsSync(schemaPath)) {
  console.warn('WARN: current file is exist')
}

fs.writeFileSync(`${__dirname}/../db/models/${name}.ts`, dbModel)
fs.writeFileSync(`${__dirname}/../src/resolvers/${name}.ts`, gqlSchema)

console.log(`Creating ${modelPath}
Creating ${schemaPath}`)