import { IMiddleware } from '@midwayjs/core';
import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { Casbin } from '../util/casbin';
import { Jwt } from '../util/jwt';
import { PathToRegexp } from '../util/path_to_regexp';
@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('whitelist') private readonly whitelist;
  @Inject() private readonly casbin: Casbin;
  @Inject() private readonly jwt: Jwt;
  @Inject() private readonly pathToRegexp: PathToRegexp;
  public resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { originalUrl: path, header, method } = ctx;
      if (this.pathToRegexp.pathMatch(this.whitelist, path, false)) {
        await next();
      } else {
        const [, token] = header.authorization?.trim().split(' ') || ['', ''];
        if (!token) {
          throw new Error('请先登录');
        }
        const isRevoked = await this.jwt.checkRevoked(token);
        if (isRevoked) {
          throw new Error('登录已失效');
        }
        const { payload: user } = this.jwt.verify(token) as { payload };
        ctx.state.token = token;
        ctx.state.user = user;
        const hasPermission = await this.casbin.getEnforcer().enforce(user.role, path, method);
        if (!hasPermission) {
          throw new Error('没有权限');
        }
        await next();
      }
    };
  }
}
