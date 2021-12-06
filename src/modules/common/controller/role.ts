import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Put, Query } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { RoleDto } from '../dto/role';
import { RoleService } from '../service/role';
@Controller('/role', { description: '角色管理' })
export class RoleController extends BaseController {
  @Inject() private readonly roleService: RoleService;
  @Get('/', { description: '获取角色列表' })
  public async index(@Query(ALL) query) {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, ...filter } = query;
    const result = await this.roleService.findAllWithPaginate(filter, { page, limit, sort });
    this.success(result);
  }
  @Post('/', { description: '新建角色' })
  public async create(@Body(ALL) body: RoleDto) {
    const result = await this.roleService.create(body);
    this.success(result);
  }
  @Put('/:id', { description: '更新角色' })
  public async update(@Param() id: string, @Body(ALL) body: RoleDto) {
    const result = await this.roleService.updateById(id, body);
    this.success(result);
  }
  @Del('/:id', { description: '删除角色' })
  public async destroy(@Param() id: string) {
    const result = await this.roleService.deleteById(id);
    await this.roleService.removeAccessList(result.roleId);
    this.success(result);
  }
  @Get('/getAccessTree', { description: '获取权限树' })
  public async getAccessTree() {
    const result = await this.roleService.getAccessTree();
    this.success(result);
  }
  @Get('/getAccessList', { description: '获取角色权限' })
  public async getAccessList(@Query() roleId: string) {
    const result = await this.roleService.getAccessList(roleId);
    this.success(result);
  }
  @Post('/updateAccessList', { description: '更新角色权限' })
  public async updateAccessList(@Query() roleId: string, @Body(ALL) body: string[]) {
    const result = await this.roleService.updateAccessList(roleId, body);
    this.success(result);
  }
}
