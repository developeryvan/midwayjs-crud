import { Config, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as jwt from 'jsonwebtoken';
import { Lock } from './lock';
import { Crypto } from './crypto';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Jwt {
  @Config('jwt.secret') secret;
  @Config('jwt.signOptions') signOptions;
  @Config('jwt.verifyOptions') verifyOptions;
  @Inject() lock: Lock;
  @Inject() crypto: Crypto;
  sign(payload: string | Record<string, unknown>, secretOrPrivateKey?: string, options?: jwt.SignOptions): string {
    const secret = secretOrPrivateKey ? secretOrPrivateKey : this.secret;
    const opts: jwt.SignOptions = Object.assign(this.signOptions, options);
    return jwt.sign(payload, secret, opts);
  }
  verify(token: string, secretOrPublicKey?: string, options?: jwt.VerifyOptions) {
    const secret = secretOrPublicKey ? secretOrPublicKey : this.secret;
    const opts: jwt.VerifyOptions = Object.assign(this.verifyOptions, options);
    return jwt.verify(token, secret, opts) as Record<string, unknown>;
  }
  async revoke(token: string) {
    const key = this.crypto.md5(token);
    await this.lock.lock(key, this.signOptions.expiresIn);
  }
  async checkRevoked(token: string) {
    const key = this.crypto.md5(token);
    const result = await this.lock.checkLock(key);
    return result;
  }
}
