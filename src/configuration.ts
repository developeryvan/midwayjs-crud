import { join } from 'path';
import * as axios from '@midwayjs/axios';
import { IMidwayContainer } from '@midwayjs/core';
import { Configuration } from '@midwayjs/decorator';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as task from '@midwayjs/task';
import * as typegoose from '@midwayjs/typegoose';
import * as view from '@midwayjs/view-nunjucks';
import { setGlobalOptions, Severity } from '@typegoose/typegoose';
setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
@Configuration({
  imports: [
    typegoose,
    redis,
    view,
    axios,
    task,
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config/')],
  conflictCheck: true,
})
export class ContainerLifeCycle {
  public async onReady(container: IMidwayContainer): Promise<void> {
    await container.getAsync('userService');
  }
}
