import { Controller, Del, Get, Post, Put } from '@midwayjs/decorator';
import { ApiBody, ApiParam, ApiProperty, ApiQuery } from '@midwayjs/swagger';

class BaseDto {
  @ApiProperty()
  public select: unknown;

  @ApiProperty()
  public include: unknown;

  @ApiProperty()
  public sort: unknown;

  @ApiProperty()
  public page: number;

  @ApiProperty()
  public limit: number;
}

export const Crud = (prefix = '/', routerOptions, crudOptions): ClassDecorator => {
  const decorators = {
    index: [
      Get('/', { description: '列表' }),
      Get('/platform', { description: '平台列表' }),
      Get('/my', { description: '用户列表' }),
      ApiQuery({ type: crudOptions.dto?.index || BaseDto }),
    ],
    show: [
      Get('/:id', { description: '详情' }),
      ApiParam({ name: 'id', type: 'string', required: true }),
      ApiQuery({ type: BaseDto }),
    ],
    create: [
      Post('/', { description: '新建' }),
      Post('/platform', { description: '平台新建' }),
      Post('/my', { description: '用户新建' }),
      ApiBody({ type: crudOptions.dto?.create }),
    ],
    update: [
      Put('/:id', { description: '更新' }),
      ApiParam({ name: 'id', type: 'string', required: true }),
      ApiBody({ type: crudOptions.dto?.update }),
    ],
    destroy: [Del('/:id', { description: '删除' }), ApiParam({ name: 'id', type: 'string', required: true })],
  };
  // const routerParams = {
  //   index: [
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 0,
  //       propertyName: 'index',
  //       metadata: { type: RouteParamTypes.QUERY },
  //       impl: true,
  //     },
  //   ],
  //   show: [
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 1,
  //       propertyName: 'show',
  //       metadata: { type: RouteParamTypes.QUERY },
  //       impl: true,
  //     },
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 0,
  //       propertyName: 'show',
  //       metadata: { type: RouteParamTypes.PARAM, propertyData: 'id' },
  //       impl: true,
  //     },
  //   ],
  //   create: [
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 1,
  //       propertyName: 'create',
  //       metadata: { type: RouteParamTypes.BODY },
  //       impl: true,
  //     },
  //   ],
  //   update: [
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 1,
  //       propertyName: 'update',
  //       metadata: { type: RouteParamTypes.BODY },
  //       impl: true,
  //     },
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 0,
  //       propertyName: 'update',
  //       metadata: { type: RouteParamTypes.PARAM, propertyData: 'id' },
  //       impl: true,
  //     },
  //   ],
  //   destroy: [
  //     {
  //       key: WEB_ROUTER_PARAM_KEY,
  //       parameterIndex: 0,
  //       propertyName: 'destroy',
  //       metadata: { type: RouteParamTypes.PARAM, propertyData: 'id' },
  //       impl: true,
  //     },
  //   ],
  // };
  return (target) => {
    for (const propertyKey of crudOptions.apis) {
      Reflect.decorate(decorators[propertyKey], target, propertyKey);
      // for (const data of routerParams[propertyKey]) {
      //   attachClassMetadata(INJECT_CUSTOM_PARAM, data, target, propertyKey, 'multi');
      // }
    }
    Controller(prefix, routerOptions)(target);
  };
};
