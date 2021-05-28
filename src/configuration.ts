import { join } from 'path';
import { readdirSync } from 'fs';

import { Config, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { getModelForClass } from '@typegoose/typegoose';
import { Connection, createConnection } from 'mongoose';
@Configuration({ importConfigs: [join(__dirname, './config')], conflictCheck: true })
export class ContainerLifeCycle implements ILifeCycle {
  @Config('mongodb.clients') private mongodbClientsConfig;
  async registerMongodb(container: IMidwayContainer): Promise<void> {
    for (const connectionName in this.mongodbClientsConfig) {
      const { uri, options } = this.mongodbClientsConfig[connectionName];
      const connection: Connection = createConnection(uri, options);
      connection.on('connected', async () => {
        readdirSync(join(__dirname, './model')).forEach(async name => {
          const uninitializedClass = require(`./model/${name}`);
          const identifier = `${uninitializedClass.default.name.toString().toLowerCase()}Model`;
          const target = getModelForClass(uninitializedClass.default, { existingConnection: connection });
          if (uninitializedClass.default.connectionName === connectionName || (!uninitializedClass.default.connectionName && connectionName === 'main')) {
            container.registerObject(identifier, target);
          }
        });
      });
    }
  }
  async onReady(container: IMidwayContainer) {
    await this.registerMongodb(container);
  }
}
