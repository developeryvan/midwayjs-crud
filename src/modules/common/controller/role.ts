import { Body, Get, Inject, Post, Query } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { Crud } from '../../../decorator/crud';
import { RoleService } from '../service/role';

@Crud('/role', { description: '角色管理' }, { apis: ['index', 'show', 'create', 'update', 'destroy'] })
export class RoleController extends BaseController {
  @Inject()
  protected service: RoleService;

  @Get('/get-access-tree', { description: '获取权限树' })
  public async getAccessTree() {
    const result = await this.service.getAccessTree();
    return this.success(result);
  }

  @Get('/get-access-list', { description: '获取角色权限' })
  public async getAccessList(@Query('roleId') roleId: string) {
    const result = await this.service.getAccessList(roleId);
    return this.success(result);
  }

  @Post('/update-access-list', { description: '更新角色权限' })
  public async updateAccessList(@Query('roleId') roleId: string, @Body() body) {
    await this.service.updateAccessList(roleId, body);
    return this.success();
  }
}
