import { Provide, Inject, Schedule, CommonSchedule } from '@midwayjs/decorator';

import { RepositoryService } from '../service/repository';
@Provide()
@Schedule({ type: 'worker', interval: 1000 * 60 * 60 * 24 * 30, immediate: true })
export class RepositoryFetchCron implements CommonSchedule {
  @Inject() repositoryService: RepositoryService;
  async exec() {
    // this.repositoryService.fetch({ keyword: 'language:typescript stars:>10000', order: 'asc' });
    this.repositoryService.fetchByCode({ keyword: 'midwayjs filename:package extension:json' });
  }
}
