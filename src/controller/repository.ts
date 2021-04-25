import { ALL, Controller, Get, Inject, Provide, Query } from '@midwayjs/decorator';

import BaseController from '../core/base_controller';
import { RepositoryService } from '../service/repository';
@Provide()
@Controller('/repository')
export class RepositoryController extends BaseController {
  @Inject() repositoryService: RepositoryService;
  @Get('/') async index(@Query(ALL) query) {
    const result = await this.repositoryService.findAll(query);
    this.success(result);
  }
}
