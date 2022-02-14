import { join } from 'path';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import * as crossDomain from '@midwayjs/cross-domain';
import { App, Configuration, Inject } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as oss from '@midwayjs/oss';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as task from '@midwayjs/task';
import * as typegoose from '@midwayjs/typegoose';
import * as view from '@midwayjs/view-nunjucks';
import { setGlobalOptions, Severity } from '@typegoose/typegoose';
import { DefaultFilter } from './filter/default';
import { AuthMiddleware } from './middleware/auth';
import { ReportMiddleware } from './middleware/report';
import { Nacos } from './nacos';

setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });

@Configuration({
  imports: [crossDomain, koa, oss, redis, task, typegoose, view, { component: swagger, enabledEnvironment: ['local'] }],
  importConfigs: [join(__dirname, './config/')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  private readonly app: koa.Application;

  @Inject()
  private readonly nacos: Nacos;

  public async onConfigLoad() {
    const data = this.nacos.getConfig();
    return { data };
  }

  public async onReady(container: IMidwayContainer) {
    this.app.useMiddleware([ReportMiddleware, AuthMiddleware]);
    this.app.useFilter([DefaultFilter]);
    container.getAsync('githubRepositoryService');
  }
}
