import { WebRouterCollector } from '@midwayjs/core';
import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import { Casbin } from '../../../util/casbin';
import { Role, RoleModel } from '../model/role';
@Provide()
export class RoleService extends BaseService<Role> {
  @Inject() private readonly casbin: Casbin;
  @InjectEntityModel(Role) protected model: RoleModel;
  public async getAccessTree() {
    const collector = new WebRouterCollector();
    const routePriorityList = await collector.getRoutePriorityList();
    const parentAccessList = [
      ...new Set(
        routePriorityList.map(routerPriority => ({
          id: Buffer.from(`(GET)|(POST)|(PUT)|(DELETE) ${routerPriority.prefix}/*`).toString('base64'),
          label: routerPriority.routerOptions.description,
        }))
      ),
    ];
    const routerTable = await collector.getFlattenRouterTable();
    const childrenAccessList = routerTable.map(routerInfo => ({
      parentId: Buffer.from(`(GET)|(POST)|(PUT)|(DELETE) ${routerInfo.prefix}/*`).toString('base64'),
      id: Buffer.from(`${routerInfo.requestMethod.toUpperCase()} ${routerInfo.prefix}${routerInfo.url}`).toString('base64'),
      label: routerInfo.description,
    }));
    const accessList = [...parentAccessList, ...childrenAccessList];
    return this.arrayToTree(accessList, 'id', 'parentId');
  }
  public async getAccessList(roleId: string) {
    const policyList = await this.casbin.getEnforcer().getFilteredPolicy(0, roleId);
    return policyList.map(item => Buffer.from(`${item[2]} ${item[1]}`).toString('base64'));
  }
  public async updateAccessList(roleId: string, accessList: string[]) {
    const enforcer = this.casbin.getEnforcer();
    await enforcer.removeFilteredPolicy(0, roleId);
    for (const access of accessList) {
      const [act, obj] = Buffer.from(access, 'base64').toString().split(' ');
      await enforcer.addPolicy(roleId, obj, act);
    }
    return true;
  }
  public async removeAccessList(roleId: string) {
    await this.casbin.getEnforcer().removeFilteredPolicy(0, roleId);
    return true;
  }
  private arrayToTree(data, id: string, parentId: string) {
    const result = [];
    const hash = {};
    data.forEach(item => {
      hash[item[id]] = item;
    });
    data.forEach(item => {
      const hashParent = hash[item[parentId]];
      if (hashParent) {
        !hashParent.children && (hashParent.children = []);
        hashParent.children.push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  }
}
