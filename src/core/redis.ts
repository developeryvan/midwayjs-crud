import { Autoload, Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as IORedis from 'ioredis';

import Nacos from './nacos';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Redis {
  private clients: { [name: string]: IORedis.Redis } = {};
  private config = {};
  @Inject() private nacos: Nacos;
  @Init() protected async init(): Promise<void> {
    const redisConfig = this.nacos.getConfig('redis');
    for (const key in redisConfig.clients) {
      const config = redisConfig.clients[key];
      const connection = new IORedis(config);
      connection
        .once('connect', () => {
          console.log(`redis (${key}) connected successfully`);
        })
        .on('error', error => {
          console.log(error);
        });
      this.clients[key] = connection;
      this.config[key] = config;
    }
  }
  public getConnection(name: string): IORedis.Redis {
    return this.clients[name];
  }
  public getConfig(name: string) {
    return this.config[name];
  }
}
