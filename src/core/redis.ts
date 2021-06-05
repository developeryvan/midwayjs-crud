import { Autoload, Config, Init, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import * as IORedis from 'ioredis';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export class Redis {
  private clients: { [name: string]: IORedis.Redis } = {};
  @Config('redis.clients') private clientsConfig;
  @Logger() logger: ILogger;
  @Init() protected async init(): Promise<void> {
    for (const key in this.clientsConfig) {
      const config = this.clientsConfig[key];
      const connection = new IORedis(config);
      connection
        .once('connect', () => {
          this.logger.info(`redis (${key}) connected successfully`);
        })
        .on('error', error => {
          this.logger.error(error);
        });
      this.clients[key] = connection;
    }
  }
  public getConnection(name: string): IORedis.Redis {
    return this.clients[name];
  }
}
