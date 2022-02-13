import { MidwayConfig } from '@midwayjs/core';
export default {
  bodyParser: { enableTypes: ['json', 'form', 'text', 'xml'] },
  cors: {
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    origin: req => req.headers.origin,
  },
  jwt: { secret: '123456', signOptions: { expiresIn: 86400 }, verifyOptions: { complete: true } },
  keys: 'YVANCHEN-DEVELOP',
  koa: { port: 7001 },
  // oss: {
  //   client: {
  //     accessKeyId: '***',
  //     accessKeySecret: '***',
  //     bucket: '***',
  //     endpoint: 'oss-cn-shenzhen.aliyuncs.com',
  //   },
  // },
  view: { defaultViewEngine: 'nunjucks', mapping: { '.nj': 'nunjucks' } },
  whitelist: ['/auth/login', '/offiaccount', '/openplatform', '/swagger-ui'],
} as MidwayConfig;
