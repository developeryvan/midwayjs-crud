const config = {
  nacosClient: {
    serverAddr: '120.76.173.175:8848',
    username: 'midwayjs',
    password: '12345678',
    namespace: '76556b0e-9ac3-4d24-98ae-64100cb3f09e',
    dataId: 'midwayjs.json',
    group: 'DEFAULT_GROUP',
  },
  env: process.env.env || 'local',
};
export default config;
