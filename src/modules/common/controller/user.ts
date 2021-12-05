import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Put, Query } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { UserService } from '../service/user';
@Provide()
@Controller('/user', { description: '用户管理' })
export class UserController extends BaseController {
  @Inject() private readonly userService: UserService;

  @Del('/:id', { description: '删除用户' })
  public async destroy(@Param() id: string) {
    const result = await this.userService.deleteById(id);
    this.success(result);
  }

  @Get('/', { description: '获取用户列表' })
  public async index(@Query(ALL) query) {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, ...filter } = query;
    const result = await this.userService.findAllWithPaginate(filter, { page, limit, sort });
    this.success(result);
  }

  @Get('/:id', { description: '获取用户信息' })
  public async show(@Param() id: string) {
    const result = await this.userService.findById(id);
    this.success(result);
  }

  @Post('/', { description: '新建用户' })
  public async create(@Body(ALL) body) {
    const result = await this.userService.create(body);
    this.success(result);
  }

  @Put('/:id', { description: '更新用户' })
  public async update(@Param() id, @Body(ALL) body) {
    const result = await this.userService.updateById(id, body);
    this.success(result);
  }
}
