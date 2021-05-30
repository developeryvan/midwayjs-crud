import { join } from 'path';

import { App, Config, Configuration, getClassMetadata, listModule, MidwayFrameworkType } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { Application as SocketApplication } from '@midwayjs/socketio';
import { getModelForClass } from '@typegoose/typegoose';
import { Connection, createConnection } from 'mongoose';
@Configuration({ importConfigs: [join(__dirname, './config')], conflictCheck: true })
export class ContainerLifeCycle implements ILifeCycle {
  @Config('mongodb.clients') private mongodbClientsConfig;
  @App(MidwayFrameworkType.WS_IO) socketApp: SocketApplication;
  async registerMongodb(container: IMidwayContainer): Promise<void> {
    for (const connectionName in this.mongodbClientsConfig) {
      const { uri, options } = this.mongodbClientsConfig[connectionName];
      const connection: Connection = createConnection(uri, options);
      connection.on('connected', async () => {
        const CONNECTION_NAME_KEY = 'connectionNameKey';
        const modules = listModule(CONNECTION_NAME_KEY);
        for (const module of modules) {
          const data = getClassMetadata(CONNECTION_NAME_KEY, module);
          const identifier = `${module.name.toLowerCase()}Model`;
          const target = getModelForClass(module, { existingConnection: connection });
          if (data.connectionName === connectionName) container.registerObject(identifier, target);
        }
      });
    }
  }
  async onReady(container: IMidwayContainer) {
    await this.registerMongodb(container);
    this.socketApp.on('connection', socket => {
      console.log(socket.id);
    });
  }
}
