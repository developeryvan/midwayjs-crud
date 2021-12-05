import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { RedisServiceFactory } from '@midwayjs/redis';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Lock {
  @Inject() private readonly redisServiceFactory: RedisServiceFactory;

  public async checkLock(key: string) {
    const result = await this.redisServiceFactory.get('cache').get(key);
    return !!result;
  }

  public async lock(key: string, timeout = 120) {
    await this.redisServiceFactory.get('cache').set(key, 1, 'EX', timeout);
  }

  public async unlock(key: string) {
    await this.redisServiceFactory.get('cache').del(key);
  }
}
