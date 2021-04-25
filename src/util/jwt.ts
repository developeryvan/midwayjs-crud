import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as jwt from 'jsonwebtoken';

import Nacos from '../core/nacos';
import Redis from '../core/redis';

import { Crypto } from './crypto';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Jwt {
  @Inject() nacos: Nacos;
  @Inject() redis: Redis;
  @Inject() crypto: Crypto;
  sign(payload: string | { [key: string]: any }, secretOrPrivateKey?: string, options?: jwt.SignOptions): string {
    const secret = secretOrPrivateKey ? secretOrPrivateKey : this.nacos.getConfig('jwt').secret;
    const opts: jwt.SignOptions = Object.assign(this.nacos.getConfig('jwt').signOptions, options);
    return jwt.sign(payload, secret, opts);
  }
  verify(token: string, secretOrPublicKey?: string, options?: jwt.VerifyOptions) {
    const secret = secretOrPublicKey ? secretOrPublicKey : this.nacos.getConfig('jwt').secret;
    const opts: jwt.VerifyOptions = Object.assign(this.nacos.getConfig('jwt').verifyOptions, options);
    return jwt.verify(token, secret, opts) as Record<string, unknown>;
  }
  async revoke(token: string) {
    const key = this.crypto.md5(token);
    await this.redis.getConnection('cache').set(key, 1, 'EX', this.nacos.getConfig('jwt').signOptions.expiresIn);
  }
  async checkRevoked(token: string) {
    const key = this.crypto.md5(token);
    const result = await this.redis.getConnection('cache').get(key);
    return !!result;
  }
}
