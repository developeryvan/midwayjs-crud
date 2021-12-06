import { join } from 'path';
export default appInfo => {
  const config = {
    koa: { port: 7001 },
    view: { root: join(appInfo.baseDir, 'view'), defaultViewEngine: 'nunjucks', mapping: { '.nj': 'nunjucks' } },
    whitelist: ['/auth/login', '/home', '/swagger-ui', '/test'],
    cipherKey: 'YVANCHEN-DEVELOP',
    jwt: { secret: '123456', signOptions: { expiresIn: 86400 }, verifyOptions: { complete: true } },
  };
  return config;
};
