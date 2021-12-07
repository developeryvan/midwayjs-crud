import { RedisWatcher } from '@casbin/redis-watcher';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Enforcer, newEnforcer, newModel } from 'casbin';
import { MongooseAdapter } from 'casbin-mongoose-adapter';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Casbin {
  @Config('mongoose.clients') private readonly mongooseClients;
  @Config('redis.clients') private readonly redisClients;
  private enforcer: Enforcer;
  @Init()
  public async init(): Promise<void> {
    const model = newModel();
    model.addDef('r', 'r', 'sub, obj, act');
    model.addDef('p', 'p', 'sub, obj, act');
    model.addDef('e', 'e', 'some(where (p.eft == allow))');
    model.addDef('m', 'm', 'r.sub == p.sub && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act) || r.sub == "admin"');
    const adapter = await MongooseAdapter.newAdapter(this.mongooseClients.default.uri, this.mongooseClients.default.options);
    this.enforcer = await newEnforcer(model, adapter);
    const watcher = await RedisWatcher.newWatcher(this.redisClients.cache);
    this.enforcer.setWatcher(watcher);
  }
  public getEnforcer(): Enforcer {
    return this.enforcer;
  }
}
