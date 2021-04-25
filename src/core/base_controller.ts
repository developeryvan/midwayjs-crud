import { Inject, Provide } from '@midwayjs/decorator';
import { IMidwayWebContext } from '@midwayjs/web';
@Provide()
export default abstract class BaseController {
  @Inject() ctx: IMidwayWebContext;
  success(content?) {
    const { ctx } = this;
    ctx.body = { header: { status: 0 }, content };
  }
  failure(status = -1, message = 'system error') {
    const { ctx } = this;
    ctx.body = { header: { status, message } };
  }
}
