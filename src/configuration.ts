import { join } from 'path';
import { readdirSync } from 'fs';

import { Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { getModelForClass } from '@typegoose/typegoose';

import Mongodb from './core/mongodb';
@Configuration({ importConfigs: [join(__dirname, './config')], conflictCheck: true })
export class ContainerLifeCycle implements ILifeCycle {
  async onReady(container: IMidwayContainer) {
    readdirSync(join(__dirname, './model')).forEach(async name => {
      const uninitializedClass = require(`./model/${name}`);
      for (const key in uninitializedClass) {
        const mongodb = await container.getAsync<Mongodb>('mongodb');
        const mainConnection = mongodb.getConnection('main');
        const model = getModelForClass(uninitializedClass[key], { existingConnection: mainConnection });
        container.registerObject(`${key.toLowerCase()}Model`, model);
      }
    });
  }
}
