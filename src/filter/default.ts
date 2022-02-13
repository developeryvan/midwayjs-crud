import { MidwayHttpError } from '@midwayjs/core';
import { Catch, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { LogService } from '../modules/common/service/log';
@Catch()
export class DefaultFilter {
  @Inject() private readonly log: LogService;
  public async catch(error: MidwayHttpError, ctx: Context) {
    console.log(error);
    const errorLog = await this.log.error(ctx.state?.user?._id, ctx.url, error);
    const { status = -1 } = error;
    const message = /[\u4e00-\u9fa5]/.test(error.message) ? error.message : '服务器开小差了';
    return { header: { status, message, requestId: errorLog._id } };
  }
}
