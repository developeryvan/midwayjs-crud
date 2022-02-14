import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import { Log, LogModel } from '../model/log';

@Provide()
@Scope(ScopeEnum.Singleton)
export class LogService extends BaseService<Log> {
  @InjectEntityModel(Log)
  protected model: LogModel;

  public async error(key = 'unknown', description: string, content = {}) {
    return this.model.create({ key, type: 'error', description, content });
  }

  public async info(key = 'unknown', description: string, content = {}) {
    return this.model.create({ key, type: 'info', description, content });
  }

  public async warn(key = 'unknown', description: string, content = {}) {
    return this.model.create({ key, type: 'warn', description, content });
  }
}
