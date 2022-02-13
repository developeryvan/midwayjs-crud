import { IMiddleware } from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { ReportService } from '../modules/common/service/report';
@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject() private readonly reportService: ReportService;
  public resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      const { url, method, headers, request } = ctx;
      const ip = (headers['x-real-ip'] || headers['x-forwarded-for'] || ctx.ip) as string;
      await next();
      const responseTime = Date.now() - startTime;
      const report = await this.reportService.create({
        ip,
        url,
        method,
        body: JSON.stringify(request.body),
        response: JSON.stringify(ctx.body),
        responseTime,
      });
      Object.assign((ctx.body as { header; content })?.header || {}, { requestId: report._id });
    };
  }
}
