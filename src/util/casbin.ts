import { RedisWatcher } from '@casbin/redis-watcher';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Enforcer, newEnforcer, newModel } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Casbin {
  private enforcer: Enforcer;

  @Config('redis')
  private redisConfig;

  @Init()
  public async init(): Promise<void> {
    const model = newModel();
    model.addDef('r', 'r', 'sub, obj, act');
    model.addDef('p', 'p', 'sub, obj, act');
    model.addDef('e', 'e', 'some(where (p.eft == allow))');
    model.addDef('m', 'm', 'r.sub == p.sub && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act) || r.sub == "admin"');
    const adapter = await PrismaAdapter.newAdapter();
    this.enforcer = await newEnforcer(model, adapter);
    const watcher = await RedisWatcher.newWatcher(this.redisConfig.clients.session);
    this.enforcer.setWatcher(watcher);
  }

  public getEnforcer(): Enforcer {
    return this.enforcer;
  }
}
