# 基于 Typescript+MidwayJs+Nacos 的微服务开发架构

## 特性

- 【体验佳】 智能化的代码提示和编译时的代码检查机制
- 【易维护】 良好的应用程序分层和解耦能力
- 【可插拔】 组件化开发，代码复用

## 技术栈

- typescript/midwayjs [文档](https://midwayjs.org 'midwayjs')
- mysql/prisma [文档](https://www.prisma.io/docs/concepts 'prisma')
- redis/ioredis [文档](https://github.com/luin/ioredis 'ioredis')
- rbac/casbin [文档](https://casbin.org/docs/en/overview 'casbin')

## 快速开始

- 配置文件是用 nacos 获取的，稍微增加了复杂度，如果没有这个需求可以直接从本地 config 获取。

### 本地开发

```bash
npm i
npm run dev
open http://localhost:7001/
```

[swagger 查看所有接口](http://127.0.0.1:7001/swagger-ui/index.html)

### 部署

如需进一步了解，参见[midway 部署文档](https://midwayjs.org/docs/deployment 'midway部署文档')

## 请作者喝杯咖啡

<img src="https://user-images.githubusercontent.com/47513562/162753279-adbf63bb-301c-44f3-808d-dd8c89a0f4c6.png" width="150px">
