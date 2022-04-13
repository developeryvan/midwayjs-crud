import { MidwayConfig } from '@midwayjs/core';

export default {
  env: process.env.env || 'local',
  prisma: { url: 'mysql://root:123456@localhost:3306/api' },
  redis: {
    clients: {
      cache: { host: 'localhost', port: 6379, password: '', db: 0 },
      session: { host: 'localhost', port: 6379, password: '', db: 1 },
    },
  },
  task: {
    defaultJobOptions: { repeat: { tz: 'Asia/Shanghai' } },
    prefix: 'task',
    redis: { host: 'localhost', port: 6379, password: '', db: 2 },
  },
} as MidwayConfig;
