import { join } from 'path';
import * as cors from '@koa/cors';
import * as axios from '@midwayjs/axios';
import { App, Configuration, Inject } from '@midwayjs/decorator';
import * as Koa from '@midwayjs/koa';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as task from '@midwayjs/task';
import * as typegoose from '@midwayjs/typegoose';
import * as view from '@midwayjs/view-nunjucks';
import { setGlobalOptions, Severity } from '@typegoose/typegoose';
import * as bodyParser from 'koa-bodyparser';
import { AuthMiddleware } from './middleware/auth';
import { ErrorHandlerMiddleware } from './middleware/error_handler';
import { ReportMiddleware } from './middleware/report';
import { Nacos } from './nacos';
setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
@Configuration({
  imports: [axios, Koa, redis, task, typegoose, view, { component: swagger, enabledEnvironment: ['local'] }],
  importConfigs: [join(__dirname, './config/')],
  conflictCheck: true,
})
export class ContainerLifeCycle {
  @App() private readonly app: Koa.Application;
  @Inject() private readonly nacos: Nacos;
  public async onConfigLoad() {
    const data = this.nacos.getConfig();
    return { data };
  }
  public async onReady() {
    this.app.useMiddleware(cors({ origin: '*' }));
    this.app.useMiddleware(bodyParser({ enableTypes: ['json', 'form', 'text', 'xml'] }));
    this.app.useMiddleware([ReportMiddleware, ErrorHandlerMiddleware, AuthMiddleware]);
  }
}
