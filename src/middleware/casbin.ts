import { IMiddleware } from '@midwayjs/core';
import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { Casbin } from '../util/casbin';
import { PathToRegexp } from '../util/path_to_regexp';

@Middleware()
export class CasbinMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  private casbin: Casbin;

  @Inject()
  private pathToRegexp: PathToRegexp;

  @Config('casbin.whitelist')
  private whitelist;

  public resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { path, method } = ctx;
      if (this.pathToRegexp.pathMatch(this.whitelist, path, false)) {
        await next();
      } else {
        const hasPermission = await this.casbin.getEnforcer().enforce(ctx.state.user.role, path, method);
        if (!hasPermission) {
          throw new Error('没有权限');
        }
        await next();
      }
    };
  }
}
