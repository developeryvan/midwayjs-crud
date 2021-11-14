import { Config, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayWebContext, IMidwayWebNext, IWebMiddleware } from '@midwayjs/web';
import { Casbin } from '../util/casbin';
import { Jwt } from '../util/jwt';
import { PathToRegexp } from '../util/path_to_regexp';
@Provide()
export class AuthMiddleware implements IWebMiddleware {
  @Inject() private readonly jwt: Jwt;
  @Inject() private readonly pathToRegexp: PathToRegexp;
  @Inject() private readonly casbin: Casbin;
  @Config('whitelist') private readonly whitelist;
  public resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext): Promise<void> => {
      const { originalUrl: path, header } = ctx;
      if (this.pathToRegexp.pathMatch(this.whitelist, path, false)) {
        await next();
      } else {
        const [, token] = header.authorization?.trim().split(' ') || ['', ''];
        if (!token) throw { message: 'invalid authorization' };
        const isRevoked = await this.jwt.checkRevoked(token);
        if (isRevoked) throw { message: 'invalid token' };
        const { payload: user } = this.jwt.verify(token);
        ctx.state.token = token;
        ctx.state.user = user;
        const hasPermission = await this.casbin.getEnforcer().enforce(user.role, path, ctx.method);
        if (!hasPermission) throw { message: 'unauthorized' };
        await next();
      }
    };
  }
}
