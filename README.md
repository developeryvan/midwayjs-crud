# 基于 Typescript+MidwayJs+Nacos 的微服务开发架构

## 特性

- 【体验佳】 智能化的代码提示和编译时的代码检查机制
- 【易维护】 良好的应用程序分层和解耦能力
- 【可插拔】 组件化开发，代码复用

## 技术栈

- typescript/midwayjs [文档](https://www.yuque.com/midwayjs/midway_v2 'midwayjs')
- mongodb/typegoose [文档](https://typegoose.github.io/typegoose/ 'typegoose')
- mongodb/mongoosejs [文档](https://mongoosejs.com/docs/guide.html 'mongoosejs')
- redis/ioredis [文档](https://github.com/luin/ioredis 'ioredis')

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

如需进一步了解，参见[midway 部署文档](https://www.yuque.com/midwayjs/midway_v2/deployment 'midway部署文档')

## 联系我(欢迎交流)

<img src="https://user-images.githubusercontent.com/47513562/145054555-7f644e71-d8d0-4d24-8b9e-e3b03691d7f5.jpg" width="150px">
