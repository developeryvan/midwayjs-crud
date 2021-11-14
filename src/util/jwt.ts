import { Config, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as jwt from 'jsonwebtoken';
import { Crypto } from './crypto';
import { Lock } from './lock';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Jwt {
  @Inject() private readonly crypto: Crypto;
  @Inject() private readonly lock: Lock;
  @Config('jwt.secret') private readonly secret;
  @Config('jwt.signOptions') private readonly signOptions;
  @Config('jwt.verifyOptions') private readonly verifyOptions;
  public async checkRevoked(token: string) {
    const key = this.crypto.md5(token);
    const result = await this.lock.checkLock(key);
    return result;
  }
  public async revoke(token: string) {
    const key = this.crypto.md5(token);
    await this.lock.lock(key, this.signOptions.expiresIn);
  }
  public sign(payload: string | Record<string, unknown>, secretOrPrivateKey?: string, options?: jwt.SignOptions): string {
    const secret = secretOrPrivateKey ? secretOrPrivateKey : this.secret;
    const opts: jwt.SignOptions = Object.assign(this.signOptions, options);
    return jwt.sign(payload, secret, opts);
  }
  public verify(token: string, secretOrPublicKey?: string, options?: jwt.VerifyOptions) {
    const secret = secretOrPublicKey ? secretOrPublicKey : this.secret;
    const opts: jwt.VerifyOptions = Object.assign(this.verifyOptions, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.verify(token, secret, opts) as Record<string, any>;
  }
}
