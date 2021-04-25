import { Provide, Inject, Schedule, CommonSchedule } from '@midwayjs/decorator';

import { RepositoryService } from '../service/repository';
@Provide()
@Schedule({ type: 'worker', interval: 1000 * 60 * 10, immediate: true })
export class RepositoryFetchCron implements CommonSchedule {
  @Inject() repositoryService: RepositoryService;
  async exec() {
    this.repositoryService.fetch({ q: 'language:typescript stars:>100', order: 'desc' });
  }
}
