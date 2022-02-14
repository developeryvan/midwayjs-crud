import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { BaseService } from './base_service';

export abstract class BaseController {
  @Inject()
  protected ctx: Context;

  protected success(content?) {
    return { header: { status: 0 }, content };
  }
}

export abstract class CrudController<T> extends BaseController {
  protected service: BaseService<T>;

  public async index() {
    const { query } = this.ctx;
    const { page = 1, limit = 20, sort = { createdAt: -1 }, ...filter } = query;
    const result = await this.service.findAllWithPaginate(filter as unknown as T, { page: Number(page), limit: Number(limit), sort });
    return this.success(result);
  }

  public async show() {
    const { params } = this.ctx;
    const { id } = params;
    const result = await this.service.findById(id);
    return this.success(result);
  }

  public async create() {
    const { body } = this.ctx.request;
    const result = await this.service.create(body);
    return this.success(result);
  }

  public async update() {
    const { params } = this.ctx;
    const { id } = params;
    const { body } = this.ctx.request;
    const result = await this.service.updateById(id, body);
    return this.success(result);
  }

  public async destroy() {
    const { params } = this.ctx;
    const { id } = params;
    const result = await this.service.deleteById(id);
    return this.success(result);
  }
}
