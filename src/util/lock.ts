import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { RedisServiceFactory } from '@midwayjs/redis';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Lock {
  @Inject()
  private readonly redis: RedisServiceFactory;

  public async checkLock(key: string) {
    const result = await this.redis.get('cache').get(key);
    return !!result;
  }

  public async lock(key: string, timeout = 120) {
    await this.redis.get('cache').set(key, 1, 'EX', timeout);
  }

  public async unlock(key: string) {
    await this.redis.get('cache').del(key);
  }
}
