import { ALL, Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { GithubRepositoryService } from '../service/repository';
@Controller('/github/repository')
export class GithubRepositoryController extends BaseController {
  @Inject() private readonly githubRepositoryService: GithubRepositoryService;
  @Get('/')
  public async index(@Query(ALL) query) {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, ...filter } = query;
    const result = await this.githubRepositoryService.findAllWithPaginate(filter, { page, limit, sort });
    this.success(result);
  }
}
