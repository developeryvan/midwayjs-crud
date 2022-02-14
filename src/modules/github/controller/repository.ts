import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { GithubRepositoryService } from '../service/repository';

@Controller('/github/repository', { description: 'GitHub管理' })
export class GithubRepositoryController extends BaseController {
  @Inject()
  private readonly githubRepositoryService: GithubRepositoryService;

  @Get('/', { description: '获取GitHub仓库' })
  public async index(@Query() query) {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, ...filter } = query;
    const result = await this.githubRepositoryService.findAllWithPaginate(filter, { page, limit, sort });
    return this.success(result);
  }
}
