import { IMiddleware } from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { ReportService } from '../modules/common/service/report';

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  private report: ReportService;

  public static getName(): string {
    return 'report';
  }

  public resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      const { path, querystring, method, headers, request } = ctx;
      const ip = (headers['x-real-ip'] || headers['x-forwarded-for'] || ctx.ip) as string;
      const result = await next();
      const responseTime = Date.now() - startTime;
      const report = await this.report.create({
        ip: ip.replace(/::ffff:/, ''),
        method,
        path,
        query: querystring,
        body: JSON.stringify(request.body),
        response: method !== 'GET' ? JSON.stringify(ctx.body) : '',
        responseTime,
      });
      Object.assign((ctx.body as { header; content })?.header || {}, { requestId: report.id });
      return result;
    };
  }
}
