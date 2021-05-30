import { Inject } from '@midwayjs/decorator';
import { IMidwayWebContext } from '@midwayjs/web';
export class BaseController {
  @Inject() protected ctx: IMidwayWebContext;
  protected success(content?) {
    const { ctx } = this;
    ctx.body = { header: { status: 0 }, content };
  }
  protected failure(status = -1, message = 'system error') {
    const { ctx } = this;
    ctx.body = { header: { status, message } };
  }
}
