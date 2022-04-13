import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Jwt {
  @Config('jwt')
  private jwtConfig;

  public sign(payload: string | Record<string, unknown>, secretOrPrivateKey?: string, options?: jwt.SignOptions) {
    const secret = secretOrPrivateKey ? secretOrPrivateKey : this.jwtConfig.secret;
    const opts = Object.assign(this.jwtConfig.signOptions, options);
    return jwt.sign(payload, secret, opts);
  }

  public verify(token: string, secretOrPublicKey?: string, options?: jwt.VerifyOptions) {
    const secret = secretOrPublicKey ? secretOrPublicKey : this.jwtConfig.secret;
    const opts = Object.assign(this.jwtConfig.verifyOptions, options);
    const { payload } = jwt.verify(token, secret, opts) as { payload: JwtPayload | string };
    return payload;
  }
}
