import { Config, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayKoaContext, IMidwayKoaNext, IWebMiddleware } from '@midwayjs/koa';
import { Casbin } from '../util/casbin';
import { Jwt } from '../util/jwt';
import { PathToRegexp } from '../util/path_to_regexp';
@Provide()
export class AuthMiddleware implements IWebMiddleware {
  @Config('whitelist') private readonly whitelist;
  @Inject() private readonly casbin: Casbin;
  @Inject() private readonly jwt: Jwt;
  @Inject() private readonly pathToRegexp: PathToRegexp;

  public resolve() {
    return async (ctx: IMidwayKoaContext, next: IMidwayKoaNext): Promise<void> => {
      const { originalUrl: path, header, method } = ctx;
      if (this.pathToRegexp.pathMatch(this.whitelist, path, false)) {
        await next();
      } else {
        const [, token] = header.authorization?.trim().split(' ') || ['', ''];
        if (!token) throw { message: 'invalid authorization' };
        const isRevoked = await this.jwt.checkRevoked(token);
        if (isRevoked) throw { message: 'invalid token' };
        const { payload: user } = this.jwt.verify(token) as { payload };
        ctx.state.token = token;
        ctx.state.user = user;
        const hasPermission = await this.casbin.getEnforcer().enforce(user.role, path, method);
        if (!hasPermission) throw { message: 'unauthorized' };
        await next();
      }
    };
  }
}
