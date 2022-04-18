import { App, Inject } from '@midwayjs/decorator';
import { Application, Context } from '@midwayjs/koa';

export abstract class BaseController {
  @App()
  protected app: Application;

  @Inject()
  protected ctx: Context;

  protected service;

  public async index() {
    const { query } = this.ctx;
    const { select, include, sort = JSON.stringify({ createdAt: 'desc' }), page = 1, limit = 20, ...where } = query;
    const result = await this.service.findAll(where, {
      select,
      include,
      sort: JSON.parse(sort as string),
      page: Number(page),
      limit: Number(limit),
    });
    return this.success(result);
  }

  public async show() {
    const { params, query } = this.ctx;
    const { id } = params;
    const result = await this.service.findById(isNaN(id) ? id : +id, query);
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
    const result = await this.service.updateOne({ id: isNaN(id) ? id : +id }, body);
    return this.success(result);
  }

  public async destroy() {
    const { params } = this.ctx;
    const { id } = params;
    const result = await this.service.deleteById(isNaN(id) ? id : +id);
    return this.success(result);
  }

  protected success(content?) {
    return { header: { status: 0 }, content };
  }
}
