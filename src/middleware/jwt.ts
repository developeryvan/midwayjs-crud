import { IMiddleware, MidwayHttpError } from '@midwayjs/core';
import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { Jwt } from '../util/jwt';
import { PathToRegexp } from '../util/path_to_regexp';

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  private jwt: Jwt;

  @Inject()
  private pathToRegexp: PathToRegexp;

  @Config('jwt.whitelist')
  private whitelist;

  public static getName(): string {
    return 'jwt';
  }

  public resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { path, header } = ctx;
      const [, token] = header.authorization?.trim().split(' ') || ['', ''];
      const ignore = this.pathToRegexp.pathMatch(this.whitelist, path, false);
      if (!token && !ignore) {
        throw new MidwayHttpError('请先登录', 401);
      }
      try {
        const user = this.jwt.verify(token);
        ctx.state.token = token;
        ctx.state.user = user;
      } catch (error) {
        if (!ignore) {
          throw new MidwayHttpError('登录失效', 401);
        }
      }
      await next();
    };
  }
}
