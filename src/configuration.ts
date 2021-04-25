import { join } from 'path';

import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
@Configuration({ importConfigs: [join(__dirname, './config')], conflictCheck: true })
export class ContainerLifeCycle implements ILifeCycle {
  @App() app: IMidwayApplication;
  async onReady(container?: IMidwayContainer): Promise<void> {
    await container.getAsync('nacos');
    await container.getAsync('mongodb');
    await container.getAsync('redis');
  }
}
