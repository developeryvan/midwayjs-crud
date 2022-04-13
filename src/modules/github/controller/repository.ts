import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { GithubRepositoryService } from '../service/repository';

@Controller('/github/repository', { description: 'GitHub管理' })
export class GithubRepositoryController extends BaseController {
  @Inject()
  private githubRepositoryService: GithubRepositoryService;

  @Get('/fetch-all', { description: '获取GitHub仓库' })
  public async fetchAll(@Query('keyword') keyword: string, @Query('minStar') minStar: number) {
    this.githubRepositoryService.fetchAll(keyword, minStar);
    return this.success();
  }

  @Get('/fetch-by-code', { description: '通过代码获取GitHub仓库' })
  public async fetchByCode(@Query('keyword') keyword: string) {
    this.githubRepositoryService.fetchByCode(keyword);
    return this.success();
  }
}
