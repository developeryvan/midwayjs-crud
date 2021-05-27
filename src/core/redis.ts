import { Autoload, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as IORedis from 'ioredis';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Redis {
  private clients: { [name: string]: IORedis.Redis } = {};
  @Config('redis.clients') private clientsConfig;
  @Init() protected async init(): Promise<void> {
    for (const key in this.clientsConfig) {
      const config = this.clientsConfig[key];
      const connection = new IORedis(config);
      connection
        .once('connect', () => {
          console.log(`redis (${key}) connected successfully`);
        })
        .on('error', error => {
          console.log(error);
        });
      this.clients[key] = connection;
    }
  }
  public getConnection(name: string): IORedis.Redis {
    return this.clients[name];
  }
}
