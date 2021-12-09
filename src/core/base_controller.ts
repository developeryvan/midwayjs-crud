import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
export abstract class BaseController {
  @Inject() protected ctx: Context;
  protected failure(status = -1, message = 'system error') {
    const { ctx } = this;
    ctx.body = { header: { status, message } };
  }
  protected success(content?) {
    const { ctx } = this;
    ctx.body = { header: { status: 0 }, content };
  }
}
