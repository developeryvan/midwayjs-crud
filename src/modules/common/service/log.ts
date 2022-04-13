import { FORMAT, Inject, Provide, Scope, ScopeEnum, Task } from '@midwayjs/decorator';
import { Log, PrismaClient } from '@prisma/client';
import { BaseService } from '../../../core/base_service';

@Provide()
@Scope(ScopeEnum.Singleton)
export class LogService extends BaseService<Log> {
  @Inject('prisma')
  private prismaClient: PrismaClient;

  protected get model() {
    return this.prismaClient.log;
  }

  @Task({ repeat: { cron: FORMAT.CRONTAB.EVERY_DAY } })
  public async deleteMany() {
    await this.model.deleteMany({
      where: { createdAt: { lte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3) } },
    });
  }

  public async error(key: string, description: string, content) {
    this.app.getLogger().error(content);
    const model = await this.model.create({ data: { key, type: 'error', description, content } });
    return model;
  }

  public async info(key: string, description: string, content) {
    const model = await this.model.create({ data: { key, type: 'info', description, content } });
    return model;
  }

  public async warn(key: string, description: string, content) {
    const model = await this.model.create({ data: { key, type: 'warn', description, content } });
    return model;
  }
}
