import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebContext, IMidwayWebNext } from '@midwayjs/web';
@Provide()
export class ErrorHandlerMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext): Promise<void> => {
      try {
        await next();
        if (ctx.status === 404) ctx.body = { header: { status: 404, message: 'not found' } };
      } catch (error) {
        console.log(error);
        const { status = -1, message } = error;
        ctx.body = { header: { status, message } };
      }
    };
  }
}
