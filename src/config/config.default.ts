import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export type DefaultConfig = PowerPartial<EggAppConfig>;
export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  config.bodyParser = { enableTypes: ['json', 'form', 'text', 'xml'] };
  config.keys = appInfo.name + '2021';
  config.middleware = ['reportMiddleware', 'errorHandlerMiddleware', 'jwtMiddleware'];
  config.midwayFeature = { replaceEggLogger: true };
  config.security = { csrf: false };
  config.cors = {
    origin: req => req.headers.origin,
    allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  };
  return config;
};
