import { Autoload, Init, Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Connection, createConnection } from 'mongoose';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Mongodb {
  private clients: { [name: string]: Connection } = {};
  @Config('mongodb.clients') private clientsConfig;
  @Init() protected async init(): Promise<void> {
    for (const key in this.clientsConfig) {
      const { uri, options } = this.clientsConfig[key];
      const connection: Connection = createConnection(uri, options);
      connection
        .on('connected', () => {
          console.log(`mongodb (${key}) connected successfully`);
        })
        .on('error', error => {
          console.log(error);
        });
      this.clients[key] = connection;
    }
  }
  public getConnection(name: string): Connection {
    return this.clients[name];
  }
}
