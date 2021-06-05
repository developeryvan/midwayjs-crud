import { join } from 'path';

import { App, Config, Configuration, getClassMetadata, listModule, Logger, MidwayFrameworkType } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { Application as SocketApplication } from '@midwayjs/socketio';
import { getModelForClass } from '@typegoose/typegoose';
import { Connection, createConnection } from 'mongoose';
import { ILogger } from '@midwayjs/logger';
@Configuration({ importConfigs: [join(__dirname, './config')], conflictCheck: true })
export class ContainerLifeCycle implements ILifeCycle {
  @Config('mongodb.clients') private mongodbClientsConfig;
  @Logger() logger: ILogger;
  @App(MidwayFrameworkType.WS_IO) socketApp: SocketApplication;
  registerMongodb(container: IMidwayContainer) {
    for (const connectionName in this.mongodbClientsConfig) {
      const { uri, options } = this.mongodbClientsConfig[connectionName];
      const connection: Connection = createConnection(uri, options);
      connection
        .on('connected', () => {
          this.logger.info(`mongodb (${connectionName}) connected successfully`);
          const MONGODB_CONNECTION_KEY = 'mongodb_connection_key';
          const modules = listModule(MONGODB_CONNECTION_KEY);
          for (const module of modules) {
            const data = getClassMetadata(MONGODB_CONNECTION_KEY, module);
            const identifier = `${module.name.toLowerCase()}Model`;
            const target = getModelForClass(module, { existingConnection: connection });
            if (data.connectionName === connectionName) container.registerObject(identifier, target);
          }
        })
        .on('error', error => {
          this.logger.error(error);
        });
    }
  }
  async onReady(container: IMidwayContainer) {
    this.registerMongodb(container);
    this.socketApp.on('connection', socket => {
      console.log(socket.id);
    });
  }
}
