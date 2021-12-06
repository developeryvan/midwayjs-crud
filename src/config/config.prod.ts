const config = {
  env: process.env.env || 'prod',
  nacosClient: { serverAddr: 'localhost:8848', username: 'nacos', password: '123456', namespace: 'public', dataId: 'prod.json', group: 'DEFAULT_GROUP' },
  // task: { prefix: 'task', defaultJobOptions: { repeat: { tz: 'Asia/Shanghai' } }, redis: { host: 'localhost', port: 6379, password: '', db: 0 } },
  // redis: {
  //   clients: {
  //     session: { host: 'localhost', port: 6379, password: '', db: 1 },
  //     cache: { host: 'localhost', port: 6379, password: '', db: 2 },
  //   },
  // },
  // mongoose: {
  //   clients: {
  //     default: { uri: 'mongodb://test:123456@localhost/test', options: { useNewUrlParser: true, useUnifiedTopology: true } },
  //     log: { uri: 'mongodb://test:123456@localhost/test', options: { useNewUrlParser: true, useUnifiedTopology: true } },
  //   },
  // },
};
export default config;
