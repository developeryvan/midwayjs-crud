import { Autoload, Init, Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Connection, createConnection } from 'mongoose';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Mongodb {
  private clients: { [name: string]: Connection } = {};
  private config: { [name: string]: { uri: string; options } } = {};
  @Config('mongodb') mongodbConfig;
  @Init() protected async init(): Promise<void> {
    for (const key in this.mongodbConfig.clients) {
      const { uri, options } = this.mongodbConfig.clients[key];
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
}
