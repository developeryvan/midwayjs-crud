const config = {
  nacosClient: { serverAddr: '47.115.53.158:8848', username: 'nacos', password: 'nacos', namespace: 'public', dataId: 'midwayjs', group: 'DEFAULT_GROUP' },
  env: process.env.env || 'local',
};
export default config;
