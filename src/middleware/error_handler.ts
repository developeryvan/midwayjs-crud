import { Provide } from '@midwayjs/decorator';
import { IMidwayKoaContext, IMidwayKoaNext, IWebMiddleware } from '@midwayjs/koa';
import { LogService } from '../modules/common/service/log';

@Provide()
export class ErrorHandlerMiddleware implements IWebMiddleware {
  public resolve() {
    return async (ctx: IMidwayKoaContext, next: IMidwayKoaNext): Promise<void> => {
      try {
        await next();
        if (ctx.status === 404) ctx.body = { header: { status: 404, message: 'not found' } };
      } catch (error) {
        ctx.requestContext.getAsync<LogService>('logService').then(service => service.error(ctx.state?.user?._id, ctx.url, error));
        const { status = -1, message } = error;
        ctx.body = { header: { status, message } };
      }
    };
  }
}
