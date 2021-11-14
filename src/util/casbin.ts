import { RedisWatcher } from '@casbin/redis-watcher';
import { Autoload, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Enforcer, newEnforcer, newModel } from 'casbin';
import { MongooseAdapter } from 'casbin-mongoose-adapter';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export class Casbin {
  private enforcer: Enforcer;
  @Config('mongoose.clients') private readonly mongodbClientsConfig;
  @Config('redis.clients') private readonly redisClientsConfig;
  @Init()
  public async init(): Promise<void> {
    const model = newModel();
    model.addDef('r', 'r', 'sub, obj, act');
    model.addDef('p', 'p', 'sub, obj, act');
    model.addDef('e', 'e', 'some(where (p.eft == allow))');
    model.addDef('m', 'm', 'r.sub == p.sub && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act)');
    const adapter = await MongooseAdapter.newAdapter(this.mongodbClientsConfig.default.uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.enforcer = await newEnforcer(model, adapter);
    const watcher = await RedisWatcher.newWatcher(this.redisClientsConfig.cache);
    this.enforcer.setWatcher(watcher);
  }
  public getEnforcer(): Enforcer {
    return this.enforcer;
  }
}
