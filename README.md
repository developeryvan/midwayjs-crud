# 基于 Typescript+MidwayJs+Nacos 的微服务开发架构

有点 MidwayJs 的味道,有点 EggJs 的味道,有点自己的味道。未来可能会增加配套的前端后台管理仓库，看有没有时间吧。

##特性

- 【体验佳】 智能化的代码提示和编译时的代码检查机制
- 【易维护】 良好的应用程序分层和解耦能力
- 【可插拔】 组件化开发，代码复用

##技术栈

- nodejs/eggjs [文档](https://eggjs.org/zh-cn/intro/index.html 'eggjs')
- typescript/midwayjs [文档](https://www.yuque.com/midwayjs/midway_v2 'midwayjs')
- mongodb/typegoose [文档](https://typegoose.github.io/typegoose/ 'typegoose')
- mongodb/mongoosejs [文档](https://mongoosejs.com/docs/guide.html 'mongoosejs')
- redis/ioredis [文档](https://github.com/luin/ioredis 'ioredis')

##快速开始

- 配置文件是用 nacos 获取的，稍微增加了复杂度，如果没有这个需求可以直接从本地 config 获取。
- 项目中有一个利用 github api 找出 github 上优质仓库的 demo，github token 要更换成自己的才能用。

###### 本地开发

```bash
npm i
npm run dev
open http://localhost:7001/
```

###### 部署

如需进一步了解，参见[midway 部署文档](https://www.yuque.com/midwayjs/midway_v2/deployment 'midway部署文档')
