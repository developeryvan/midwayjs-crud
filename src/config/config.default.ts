import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export type DefaultConfig = PowerPartial<EggAppConfig>;
export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  config.keys = appInfo.name + '2021';
  config.cipherKey = 'YVANCHEN-DEVELOP';
  config.whitelist = ['/test', '/swagger-ui', '/auth/login'];
  config.jwt = { secret: '123456', signOptions: { expiresIn: 86400 }, verifyOptions: { complete: true } };
  config.middleware = ['reportMiddleware', 'errorHandlerMiddleware', 'authMiddleware'];
  config.midwayFeature = { replaceEggLogger: true };
  config.bodyParser = { enableTypes: ['json', 'form', 'text', 'xml'] };
  config.proxy = true;
  config.maxIpsCount = 1;
  config.ipHeaders = 'X-Real-Ip, X-Forwarded-For';
  config.security = { csrf: false };
  config.view = { defaultViewEngine: 'nunjucks', mapping: { '.nj': 'nunjucks' } };
  config.cors = {
    origin: req => req.headers.origin,
    allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  };
  return config;
};
