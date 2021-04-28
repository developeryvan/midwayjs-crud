import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

import Redis from '../core/redis';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Lock {
  @Inject() redis: Redis;
  async lock(key: string, timeout = 120) {
    await this.redis.getConnection('cache').set(key, 1, 'EX', timeout);
  }
  async unlock(key: string) {
    await this.redis.getConnection('cache').del(key);
  }
  async checkLock(key: string) {
    const result = await this.redis.getConnection('cache').get(key);
    return !!result;
  }
}
