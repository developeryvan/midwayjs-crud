import { Autoload, Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Connection, createConnection } from 'mongoose';

import Nacos from './nacos';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Mongodb {
  private clients: { [name: string]: Connection } = {};
  private config: { [name: string]: { uri: string; options } } = {};
  @Inject() private nacos: Nacos;
  @Init() protected async init(): Promise<void> {
    const mongodbConfig = this.nacos.getConfig('mongodb');
    for (const key in mongodbConfig.clients) {
      const { uri, options } = mongodbConfig.clients[key];
      const connection: Connection = createConnection(uri, options);
      connection
        .on('connected', () => {
          console.log(`mongodb (${key}) connected successfully`);
        })
        .on('error', error => {
          console.log(error);
        });
      this.clients[key] = connection;
      this.config[key] = { uri, options };
    }
  }
  public getConnection(name: string): Connection {
    return this.clients[name];
  }
  public getConfig(name: string) {
    return this.config[name];
  }
}
