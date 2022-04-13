import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core';
import { join } from 'path';

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  return {
    bodyParser: { enableTypes: ['json', 'form', 'text', 'xml'] },
    casbin: { whitelist: ['/'] },
    cors: {
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true,
      origin: (req) => req.headers.origin,
    },
    jwt: {
      secret: '123456',
      signOptions: { expiresIn: 1000 * 60 * 60 * 24 },
      verifyOptions: { complete: true },
      whitelist: ['/swagger-ui', '/auth/login', '/github'],
    },
    keys: 'YVANCHEN-DEVELOP',
    koa: { port: 7001 },
    upload: {
      cleanTimeout: 0,
      fileSize: '10mb',
      tmpdir: join(appInfo.appDir, 'public'),
      whitelist: ['.jpg', '.jpeg', '.png'],
    },
    view: { defaultViewEngine: 'nunjucks', mapping: { '.nj': 'nunjucks' } },
  };
};
