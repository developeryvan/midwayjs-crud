import { Body, Get, Inject, Post, Query } from '@midwayjs/decorator';
import { CrudController } from '../../../core/base_controller';
import { Crud } from '../../../decorator/crud';
import { Role } from '../model/role';
import { RoleService } from '../service/role';
@Crud('/role', { description: '角色管理' }, {})
export class RoleController extends CrudController<Role> {
  @Inject() protected service: RoleService;
  @Get('/getAccessTree', { description: '获取权限树' })
  public async getAccessTree() {
    const result = await this.service.getAccessTree();
    return this.success(result);
  }
  @Get('/getAccessList', { description: '获取角色权限' })
  public async getAccessList(@Query() roleId: string) {
    const result = await this.service.getAccessList(roleId);
    return this.success(result);
  }
  @Post('/updateAccessList', { description: '更新角色权限' })
  public async updateAccessList(@Query() roleId: string, @Body() body: string[]) {
    await this.service.updateAccessList(roleId, body);
    return this.success();
  }
}
