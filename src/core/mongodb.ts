import { Init, Inject, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { Connection, createConnection } from 'mongoose';

import Nacos from './nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Mongodb {
  clients: { [name: string]: Connection } = {};
  config: { [name: string]: { uri: string; options } } = {};
  @Logger() logger: ILogger;
  @Inject() nacos: Nacos;
  @Init() async init(): Promise<void> {
    const mongodbConfig = this.nacos.getConfig('mongodb');
    for (const key in mongodbConfig.clients) {
      const { uri, options } = mongodbConfig.clients[key];
      const connection: Connection = createConnection(uri, options);
      connection
        .on('connected', () => {
          this.logger.info(`mongodb (${key}) connected successfully`);
        })
        .on('error', error => {
          this.logger.error(error);
        });
      this.clients[key] = connection;
      this.config[key] = { uri, options };
    }
  }
  getConnection(name: string): Connection {
    return this.clients[name];
  }
}
