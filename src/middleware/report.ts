import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebContext, IMidwayWebNext } from '@midwayjs/web';
import { ReportService } from '../service/report';
@Provide()
export class ReportMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx, next: IMidwayWebNext): Promise<void> => {
      const startTime = Date.now();
      const { ip, url } = ctx;
      const { method, body } = ctx.request;
      await next();
      const responseTime = Date.now() - startTime;
      const reportService: ReportService = await ctx.requestContext.getAsync('reportService');
      const report = await reportService.create({ ip, url, method, body: JSON.stringify(body), response: method !== 'GET' ? JSON.stringify(ctx.body) : null, responseTime });
      if (ctx.body?.header) ctx.body.header = Object.assign(ctx.body.header, { requestId: report._id });
    };
  }
}
