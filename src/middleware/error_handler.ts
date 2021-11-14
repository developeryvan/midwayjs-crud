import { Logger, Provide } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { IMidwayWebContext, IMidwayWebNext, IWebMiddleware } from '@midwayjs/web';
@Provide()
export class ErrorHandlerMiddleware implements IWebMiddleware {
  @Logger() private readonly logger: ILogger;
  public resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext): Promise<void> => {
      try {
        await next();
        if (ctx.status === 404) ctx.body = { header: { status: 404, message: 'not found' } };
      } catch (error) {
        this.logger.error(error);
        const { status = -1, message } = error;
        ctx.body = { header: { status, message } };
      }
    };
  }
}
