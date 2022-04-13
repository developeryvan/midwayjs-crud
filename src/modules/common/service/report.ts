import { FORMAT, Inject, Provide, Scope, ScopeEnum, Task } from '@midwayjs/decorator';
import { PrismaClient, Report } from '@prisma/client';
import { BaseService } from '../../../core/base_service';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ReportService extends BaseService<Report> {
  @Inject('prisma')
  private prismaClient: PrismaClient;

  protected get model() {
    return this.prismaClient.report;
  }

  @Task({ repeat: { cron: FORMAT.CRONTAB.EVERY_DAY } })
  public async deleteMany() {
    await this.model.deleteMany({
      where: { createdAt: { lte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1) } },
    });
  }
}
