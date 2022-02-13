import { CONTROLLER_KEY, Del, Get, Post, Provide, Put, saveClassMetadata, saveModule, Scope, ScopeEnum } from '@midwayjs/decorator';
const { entries, getOwnPropertyDescriptors, getPrototypeOf } = Object;
export function Crud(prefix = '/', routerOptions, crudOptions): ClassDecorator {
  return target => {
    const targetPrototype = target.prototype;
    let descriptors = getOwnPropertyDescriptors(targetPrototype);
    let proto = getPrototypeOf(target);
    while (proto.prototype) {
      const protoDescriptors = getOwnPropertyDescriptors(proto.prototype);
      descriptors = { ...protoDescriptors, ...descriptors };
      proto = getPrototypeOf(proto);
    }
    for (const [propName, descriptor] of entries(descriptors)) {
      const { api } = crudOptions;
      let decorator;
      switch (propName) {
        case 'index':
          decorator = Get('/', { description: '列表' });
          break;
        case 'show':
          decorator = Get('/:id', { description: '详情' });
          break;
        case 'create':
          decorator = Post('/', { description: '新建' });
          break;
        case 'update':
          decorator = Put('/:id', { description: '更新' });
          break;
        case 'destroy':
          decorator = Del('/:id', { description: '删除' });
          break;
      }
      if (decorator) {
        if (api?.length && !api.includes(propName)) {
          continue;
        }
        decorator(target, propName, descriptor);
      }
    }
    saveModule(CONTROLLER_KEY, target);
    saveClassMetadata(CONTROLLER_KEY, { prefix, routerOptions, crudOptions }, target);
    Scope(ScopeEnum.Request)(target);
    Provide()(target);
  };
}
