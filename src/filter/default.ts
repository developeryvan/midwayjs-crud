import { MidwayHttpError } from '@midwayjs/core';
import { Catch, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { LogService } from '../modules/common/service/log';

@Catch()
export class DefaultFilter {
  @Inject()
  private log: LogService;

  public async catch(error: MidwayHttpError, ctx: Context) {
    error.code = ctx?.request?.body;
    const errorLog = await this.log.error(ctx.state?.user?.id?.toString(), ctx.path, error);
    const { status = -1 } = error;
    const message = /[\u4e00-\u9fa5]/.test(error.message) ? error.message : '服务器开小差了';
    return { header: { status, message, requestId: errorLog.id } };
  }
}
