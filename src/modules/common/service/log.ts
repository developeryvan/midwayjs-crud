import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import { Log, LogModel } from '../model/log';
@Provide()
export class LogService extends BaseService<Log> {
  @InjectEntityModel(Log) protected model: LogModel;

  public async error(key = 'unknow', description: string, content = {}) {
    return this.model.create({ key, type: 'error', description, content });
  }

  public async info(key = 'unknow', description: string, content = {}) {
    return this.model.create({ key, type: 'info', description, content });
  }

  public async warning(key = 'unknow', description: string, content = {}) {
    return this.model.create({ key, type: 'warning', description, content });
  }
}
