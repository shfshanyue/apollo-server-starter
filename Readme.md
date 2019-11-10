# GraphQL Starter

使用 [apollo-server](https://github.com/apollographql/apollo-server) 帮助你快速开发 [GraphQL](https://github.com/graphql/graphql-js)。

## 技术栈

+ [GraphQL.js](https://github.com/graphql/graphql-js), [apollo-server](https://github.com/apollographql/apollo-server), [koa](https://github.com/koajs/koa), [DataLoader](https://github.com/graphql/dataloader) —- API 层
+ `PostgresSQL`, `Redis`, [ioredis](https://github.com/luin/ioredis), [sequelize](https://github.com/sequelize/sequelize), [lru-cache](https://github.com/isaacs/node-lru-cache)  -- 存储
+ [TypeScript](https://github.com/zhongsp/TypeScript), [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) -- ts 支持
+ `Joi`, `consul`, [node-consul](https://github.com/silas/node-consul#readme), [winston](https://github.com/winstonjs/winston), [sentry](https://github.com/getsentry/sentry-javascript) -- 校验，配置，日志与报警
+ `Docker`, `docker-compose`, `gitlab-CI`, `traefik`, `kubernetes` -- 部署

## 目录结构

``` bash
.
├── config                  # 配置文件
│   ├── db.js               # 数据库配置文件，主要被 sequelize-cli 使用
│   └── index.ts            # 关于本项目的配置，包括数据库，redis，主要从环境变量中读取
├── db                      # 关于 db
│   ├── index.ts            # 关于数据库的配置以及日志 (sequelize)
│   ├── migrations/         # 关于数据库的迁移脚本
│   └── models/             # 关于数据库的 Model (typescript-sequelize)
├── lib                     # 关于 lib
│   ├── error.ts            # 异常的结构化与自定义异常
│   ├── logger.ts           # 关于日志的配置 (winston)
│   ├── redis.ts            # 关于 redis 的配置以及日志 (ioredis)
│   ├── sentry.ts           # 关于 sentry 的配置以及初始化
│   └── session.ts          # 关于 CLS 的控制
├── logs                    # 日志，自动生成
│   ├── api.log             # graphql 的日志
│   ├── common.log          # 通用日志
│   ├── db.log              # 关于数据库 `SQL` 的日志
│   └── redis.log           # 关于 redis 执行语句的日志
├── middlewares             # KOA 中间件
│   ├── auth.ts             # 认证，解析出 user
│   ├── context.ts          # requestId，以及一些列上下文打进日志以及 Sentry
│   └── index.ts            # 导出所有中间件
├── scripts                 # 脚本
│   └── createSchema.ts     # 自动生成 graphql schema 与数据库 schema 的脚本
├── src                     # 关于 graphql 的一系列
│   ├── index.ts            # graphql typeDefs & resolvers
│   ├── directives/         # graphql directives
│   ├── resolvers/          # graphql resolvers (Mutation & Query)
│   ├── scalars/            # graphql scalars
│   └── utils.ts            # graphql 的辅助函数
├── .env.example            # 数据库与redis的配置，以及一些敏感数据
├── Dockerfile              # Dockerfile
├── db.docker-compose.yml   # 数据库环境准备
├── docker-compose.yml      # docker-compose
├── package-lock.json       # pakcage-lock.json
├── package.json            # package.json
├── tsconfig.json           # 关于 ts 的配置
├── index.ts                # 服务入口
└── type.ts                 # typescript 支持
```

## 准备条件

+ `docker`，你需要使用它先启动 redis 与 postgres
+ `redis`/`postgres`，如果你有数据库，则可以使用现成的数据库，而无需 `docker` 部署及启动

## 快速开始

如果没有现成的数据库，需要准备数据库 db/redis 的环境 (使用 docker，你需要有 docker 环境)，使用命令 `npm run env:db`。

``` shell
$ git clone git@github.com:shfshanyue/apollo-server-starter.git
$ cd apollo-server-starter

# 如果没有现成的数据库，准备数据库 db/redis 的环境 (使用 docker)
$ npm run env:db

# 配置环境变量
$ cp .env.example .env

# 迁移数据库
$ npm run migrate

# 开始开发
$ npm run dev
```

### 关于数据库的操作

``` shell
npm run migrate:new     # 生成新的迁移文件
npm run migrate         # 执行迁移文件
npm run migrate:undo    # 撤销执行的迁移文件
```

### 自动生成 resolve 与 数据库 model

``` shell
npm run schema hello   # 生成 Hello.ts
```

### 查看日志

``` shell
# 查看数据库的日志
$ npm run log:db

# 查看 graphql 的日志
$ LOG=query npm run log
```

## 开发指南

### 单文件管理 `typeDef` 与 `resolver`

如下，在单文件中定义 `ObjectType` 与其在 `Query` 以及 `Mutation` 中对应的查询。并把 `typeDef` 与 `resolver` 集中管理。

``` typescript
// src/resolvers/Todo.ts
const typeDef = gql`
  type Todo @sql {
    id: ID!
  }

  extend type Query {
    todos: [Todo!]
  }

  extend type Mutation {
    createTodo: TODO!
  }
`

const resolver: IResolverObject<any, AppContext> = {
  Todo: {
    user () {}
  },
  Query: {
    todos () {}
  },
  Mutation: {
    createTodo () {}
  }
}
```

### 按需取数据库字段

使用 `@findOption` 可以按需查询，并注入到 `resolver` 函数中的 `info.attributes` 字段

``` gql
type Query {
  users: [User!] @findOption
}

query USERS {
  users {
    id
    name
  }
}
```

``` typescript
function users ({}, {}, { models }, { attributes }: any) {
  return models.User.findAll({
    attributes
  })
}
```

### 分页

对列表添加 `page` 以及 `pageSize` 参数来进行分页

``` graphql
type User {
  id: ID!
  todos (
    page: Int = 1
    pageSize: Int = 10
  ): [Todo!] @findOption
}

query TODOS {
  todos (page: 1, pageSize: 10) {
    id
    name
  }
}
```


### 数据库层解决 N+1 查询问题

使用 [dataloader-sequelize](https://github.com/mickhansen/dataloader-sequelize) 解决数据库查询的 batch 问题

当使用以下查询时，会出现 N+1 查询问题

``` gql
{
  users (page: 1, pageSize: 3) {
    id
    todos {
      id
      name
    }
  }
}
```

如果不做优化，生成的 `SQL` 如下

``` sql
select id from users limit 3

select id, name from todo where user_id = 1
select id, name from todo where user_id = 2
select id, name from todo where user_id = 3
```

而使用 `dataloader` 解决 N+1 问题后，会大大减少 `SQL` 语句的条数，生成的 `SQL` 如下

``` sql
select id from users limit 3

select id, name, user_id from todo where user_id in (1, 2, 3)
```

> 注意 Batch 请求后需要返回 `user_id` 字段，为了重新分组

### N+1 Query 优化后问题

当有如下所示多级分页查询时，N+1 优化失效，所以应避免多级分页操作

> 此处只能在客户端避免多层分页查询，而当有恶意查询时会加大服务器压力。可以使用以下的 Hash Query 避免此类问题，同时也在生产环境禁掉 `introspection`

``` gql
{
  users (page: 1, pageSize: 3) {
    id
    todos (page: 1, pageSize: 3) {
      id
      name
    }
  }
}
```

``` sql
select id from users limit 3

select id, name from todo where user_id = 1 limit 3
select id, name from todo where user_id = 2 limit 3
select id, name from todo where user_id = 3 limit 3
```

### 使用 DataLoader 解决 N+1 查询问题

### 使用 ID/Hash 代替 Query

**TODO**
**需要客户端配合**

当 `Query` 越来越大时，http 所传输的请求体积越来越大，严重影响应用的性能，此时可以把 `Query` 映射成 `hash`。

当请求体变小时，此时可以替代使用 `GET` 请求，方便缓存。

**我发现掘金的 GraphQL Query 已由 ID 替代**

### 使用 `consul` 管理配置

`project` 代表本项目在 `consul` 中对应的 `key`。项目将会拉取该 `key` 对应的配置并与本地的 `config/project.ts` 做 `Object.assign` 操作。
`dependencies` 代表本项目所依赖的配置，如数据库，缓存以及用户服务等的配置，项目将会在 `consul` 上拉取依赖配置。

项目最终生成的配置为 `AppConfig` 标识。

``` typescript
// config/consul.ts
export const project = 'todo'
export const dependencies = ['redis', 'pg']
```

### 用户认证

使用 `@auth` 指令表示该资源受限，需要用户登录，`roles` 表示只有特定角色才能访问受限资源

``` graphql
directive @auth(
  # USER, ADMIN 可以自定义
  roles: [String]
) on FIELD_DEFINITION

type Query {
  authInfo: Int @auth
}
```

以下是相关代码

``` typescript
// src/directives/auth.ts
function visitFieldDefinition (field: GraphQLField<any, AppContext>) {
  const { resolve = defaultFieldResolver } = field
  const { roles } = this.args
  // const roles: UserRole[] = ['USER', 'ADMIN']
  field.resolve = async (root, args, ctx, info) => {
    if (!ctx.user) {
      throw new AuthenticationError('Unauthorized')
    }
    if (roles && !roles.includes(ctx.user.role)) {
      throw new ForbiddenError('Forbidden')
    }
    return resolve.call(this, root, args, ctx, info)
  }
}
```

### jwt 与白名单

### jwt 与 token 更新

当用户认证成功时，检查其 token 有效期，如果剩余一半时间，则生成新的 token 并赋值到响应头中。

### 用户角色验证

### 日志

为 `graphql`，`sql`，`redis` 以及一些重要信息(如 user) 添加日志，并设置标签

``` typescript
// lib/logger.ts
export const apiLogger = createLogger('api')
export const dbLogger = createLogger('db')
export const redisLogger = createLogger('redis')
export const logger = createLogger('common')
```

### 为日志添加 requestId (sessionId)

为日志添加 `requestId` 方便追踪 bug 以及检测性能问题

``` typescript
// lib/logger.ts
const requestId = format((info) => {
  info.requestId = session.get('requestId')
  return info
})
```

### 结构化异常信息

结构化 API 异常信息，其中 `extensions.code` 代表异常错误码，方便调试以及前端使用。`extensions.exception` 代表原始异常，堆栈以及详细信息。注意在生产环境需要屏蔽掉 `extensions.exception`

``` shell
$ curl 'https://todo.xiange.tech/graphql' -H 'Content-Type: application/json' --data-binary '{"query":"{\n  dbError\n}"}'
{
  "errors": [
    {
      "message": "column User.a does not exist",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "dbError"
      ],
      "extensions": {
        "code": "SequelizeDatabaseError",
        "exception": {
          "name": "SequelizeDatabaseError",
          "original": {
            "name": "error",
            "length": 104,
            "severity": "ERROR",
            "code": "42703",
            "position": "57",
            "file": "parse_relation.c",
            "line": "3293",
            "routine": "errorMissingColumn",
            "sql": "SELECT count(*) AS \"count\" FROM \"users\" AS \"User\" WHERE \"User\".\"a\" = 3;"
          },
          "sql": "SELECT count(*) AS \"count\" FROM \"users\" AS \"User\" WHERE \"User\".\"a\" = 3;",
          "stacktrace": [
            "SequelizeDatabaseError: column User.a does not exist",
            "    at Query.formatError (/code/node_modules/sequelize/lib/dialects/postgres/query.js:354:16)",
          ]
        }
      }
    }
  ],
  "data": {
    "dbError": null
  }
}
```

### 在生产环境屏蔽掉异常堆栈以及详细信息

避免把原始异常以及堆栈信息暴露在生产环境

``` typescript
{
  "errors": [
    {
      "message": "column User.a does not exist",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "dbError"
      ],
      "extensions": {
        "code": "SequelizeDatabaseError"
      }
    }
  ],
  "data": {
    "dbError": null
  }
}
```

### 异常报警

根据异常的 `code` 对异常进行严重等级分类，并上报监控系统。这里监控系统采用的 `sentry`

``` typescript
// lib/error.ts:formatError
let code: string = _.get(error, 'extensions.code', 'Error')
let info: any
let level = Severity.Error

if (isAxiosError(originalError)) {
  code = `Request${originalError.code}`
} else if (isJoiValidationError(originalError)) {
  code = 'JoiValidationError'
  info = originalError.details
} else if (isSequelizeError(originalError)) {
  code = originalError.name
  if (isUniqueConstraintError(originalError)) {
    info = originalError.fields
    level = Severity.Warning
  }
} else if (isApolloError(originalError)){
  level = originalError.level || Severity.Warning
} else if (isError(originalError)) {
  code = _.get(originalError, 'code', originalError.name)
  level = Severity.Fatal
}

Sentry.withScope(scope => {
  scope.setTag('code', code)
  scope.setLevel(level)
  scope.setExtras(formatError)
  Sentry.captureException(originalError || error)
})
```

### 健康检查

在 `k8s` 上根据健康检查监控应用状态，当应用发生异常时可以及时响应并解决

``` shell
$ curl http://todo.xiange.tech/.well-known/apollo/server-health
{"status":"pass"}
```

## filebeat & ELK

通过 `filebeat` 把日志文件发送到 `elk` 日志系统，方便日后分析以及辅助 debug

### 监控

在日志系统中监控 SQL 慢查询以及耗时 API 的日志，并实时邮件通知 (可以考虑钉钉)

### 参数校验

使用 [Joi](https://github.com/hapijs/joi) 做参数校验

``` javascript
function createUser ({}, { name, email, password }, { models, utils }) {
  Joi.assert(email, Joi.string().email())
}

function createTodo ({}, { todo }, { models, utils }) {
  Joi.validate(todo, Joi.object().keys({
    name: Joi.string().min(1),
  }))
}
```

### 服务端渲染

### npm scripts

+ `npm start`
+ `npm test`
+ `npm run dev`

### 使用 CI 加强代码质量
