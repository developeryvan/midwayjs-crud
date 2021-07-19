import { Config, Inject, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebContext, IMidwayWebNext } from '@midwayjs/web';
import { PathToRegexp } from '../util/path_to_regexp';
import { Jwt } from '../util/jwt';
@Provide()
export class JwtMiddleware implements IWebMiddleware {
  @Config('jwt.whitelist') whitelist;
  @Inject() pathToRegexp: PathToRegexp;
  @Inject() jwt: Jwt;
  resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext): Promise<void> => {
      if (this.pathToRegexp.pathMatch(this.whitelist, ctx.path, false)) {
        await next();
      } else {
        const [, token] = ctx.header.authorization?.trim().split(' ') || ['', ''];
        if (!token) throw { message: 'invalid authorization' };
        const isRevoked = await this.jwt.checkRevoked(token);
        if (isRevoked) throw { message: 'invalid token' };
        const decodedToken = this.jwt.verify(token);
        ctx.state.token = token;
        ctx.state.user = decodedToken.payload;
        await next();
      }
    };
  }
}
