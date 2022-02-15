import { MidwayConfig } from '@midwayjs/core';
export default {
  env: process.env.env || 'local',
  nacosClient: {
    serverAddr: 'localhost:8848',
    username: 'nacos',
    password: '123456',
    namespace: 'public',
    dataId: 'prod.json',
    group: 'DEFAULT_GROUP',
  },
  mongoose: {
    clients: {
      default: { uri: 'mongodb://midwayjs:midwayjs666@119.91.87.137:10086/midwayjs', options: { useNewUrlParser: true, useUnifiedTopology: true } },
      log: { uri: 'mongodb://midwayjs:midwayjs666@119.91.87.137:10086/midwayjs', options: { useNewUrlParser: true, useUnifiedTopology: true } },
    },
  },
  redis: {
    clients: {
      cache: { host: '119.91.87.137', port: 10085, password: '12345678', db: 0 },
      session: { host: '119.91.87.137', port: 10085, password: '12345678', db: 1 },
    },
  },
  task: {
    defaultJobOptions: { repeat: { tz: 'Asia/Shanghai' } },
    prefix: 'task',
    redis: { host: '119.91.87.137', port: 10085, password: '12345678', db: 2 },
  },
} as MidwayConfig;
