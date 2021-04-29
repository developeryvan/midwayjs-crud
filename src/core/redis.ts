import { Init, Inject, Provide, Scope, ScopeEnum, Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import * as IORedis from 'ioredis';

import Nacos from './nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Redis {
  clients: { [name: string]: IORedis.Redis } = {};
  config = {};
  @Logger() logger: ILogger;
  @Inject() nacos: Nacos;
  @Init() async init(): Promise<void> {
    const redisConfig = this.nacos.getConfig('redis');
    for (const key in redisConfig.clients) {
      const config = redisConfig.clients[key];
      const connection = new IORedis(config);
      connection
        .once('connect', () => {
          this.logger.info(`redis (${key}) connected successfully`);
        })
        .on('error', error => {
          this.logger.error(error);
        });
      this.clients[key] = connection;
      this.config[key] = config;
    }
  }
  getConnection(name: string): IORedis.Redis {
    return this.clients[name];
  }
}
