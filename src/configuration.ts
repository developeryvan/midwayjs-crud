import { IMidwayContainer } from '@midwayjs/core';
import * as crossDomain from '@midwayjs/cross-domain';
import { App, Config, Configuration, Inject } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as redis from '@midwayjs/redis';
import * as staticFile from '@midwayjs/static-file';
import * as swagger from '@midwayjs/swagger';
import * as task from '@midwayjs/task';
import * as upload from '@midwayjs/upload';
import * as view from '@midwayjs/view-nunjucks';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { DefaultFilter } from './filter/default';
import { CasbinMiddleware } from './middleware/casbin';
import { JwtMiddleware } from './middleware/jwt';
import { ReportMiddleware } from './middleware/report';
import { Nacos } from './nacos';

@Configuration({
  imports: [
    crossDomain,
    koa,
    redis,
    staticFile,
    task,
    upload,
    view,
    { component: swagger, enabledEnvironment: ['local'] },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  private app: koa.Application;

  @Inject()
  private nacos: Nacos;

  @Config('prisma')
  private prismaConfig;

  public async onConfigLoad() {
    const data = this.nacos.getConfig();
    return { data };
  }

  public async onReady(container: IMidwayContainer): Promise<void> {
    this.registerPrisma(container);
    this.app.useMiddleware([ReportMiddleware, JwtMiddleware, CasbinMiddleware]);
    this.app.useFilter([DefaultFilter]);
  }

  public async onStop(container: IMidwayContainer): Promise<void> {
    const prisma = await container.getAsync<PrismaClient>('prisma');
    prisma.$disconnect();
  }

  private registerPrisma(container: IMidwayContainer) {
    const prisma = new PrismaClient({
      // log: [{ emit: 'event', level: 'query' }],
      datasources: { db: { url: this.prismaConfig.url } },
    });
    prisma.$connect();
    // prisma.$on('query', (event) => {
    // console.log(event);
    // });
    container.registerObject('prisma', prisma);
  }
}
