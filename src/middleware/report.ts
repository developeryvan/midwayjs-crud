import { Provide } from '@midwayjs/decorator';
import { Context, IMidwayKoaNext, IWebMiddleware } from '@midwayjs/koa';
import { ReportService } from '../modules/common/service/report';
@Provide()
export class ReportMiddleware implements IWebMiddleware {
  public resolve() {
    return async (ctx: Context, next: IMidwayKoaNext): Promise<void> => {
      const startTime = Date.now();
      const { ip, url } = ctx;
      const { method, body } = ctx.request;
      await next();
      const responseTime = Date.now() - startTime;
      const reportService = await ctx.requestContext.getAsync<ReportService>('reportService');
      const report = await reportService.create({ ip, url, method, body: JSON.stringify(body), response: JSON.stringify(ctx.body), responseTime });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (ctx.body?.header) ctx.body.header = Object.assign(ctx.body.header, { requestId: report._id });
    };
  }
}
