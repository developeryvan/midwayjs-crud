import { CONTROLLER_KEY, Del, Get, Post, Provide, Put, saveClassMetadata, saveModule, Scope, ScopeEnum } from '@midwayjs/decorator';

const { entries, getOwnPropertyDescriptors, getPrototypeOf } = Object;

export function Crud(prefix = '/', routerOptions, crudOptions): ClassDecorator {
  return target => {
    let descriptors = {};
    let object = target;
    while (object.prototype) {
      const protoDescriptors = getOwnPropertyDescriptors(object.prototype);
      descriptors = { ...descriptors, ...protoDescriptors };
      object = getPrototypeOf(object);
    }
    for (const [propertyKey, descriptor] of entries(descriptors)) {
      const { api } = crudOptions;
      let decorator;
      switch (propertyKey) {
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
      if (!decorator || (api?.length && !api.includes(propertyKey))) {
        continue;
      }
      decorator(target, propertyKey, descriptor);
    }
    saveModule(CONTROLLER_KEY, target);
    saveClassMetadata(CONTROLLER_KEY, { prefix, routerOptions, crudOptions }, target);
    Scope(ScopeEnum.Request)(target);
    Provide()(target);
  };
}
