import { App, Inject } from '@midwayjs/decorator';
import { Application, Context } from '@midwayjs/koa';

export interface Options {
  select?: unknown;

  include?: unknown;

  sort?: unknown;

  page?: number;

  limit?: number;
}

export abstract class BaseService<T> {
  @App()
  protected app: Application;

  @Inject()
  protected ctx: Context;

  protected abstract model;

  public async create(data: Partial<T>): Promise<T> {
    const model = await this.model.create({ data });
    return model;
  }

  public async findAll(where: Partial<T>, options: Partial<Options>): Promise<{ rows: T[]; count: number }> {
    const { select, include, sort = { createdAt: 'desc' }, page = 1, limit = 20 } = options;
    const orderBy = typeof sort === 'string' ? JSON.parse(sort) : sort;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const [rows, count] = await Promise.all([
      this.model.findMany({ where, select, include, orderBy, skip, take }),
      this.model.count({ where }),
    ]);
    return { rows, count };
  }

  public async findById(id: string, options?: Partial<Options>): Promise<T> {
    const { select, include } = options || {};
    const model = await this.model.findUnique({ where: { id }, select, include });
    return model;
  }

  public async findOne(where: Partial<T>, options: Partial<Options>): Promise<T> {
    const { select, include } = options;
    const model = await this.model.findFirst({ where, select, include });
    return model;
  }

  public async updateOne(where: Partial<T>, data: Partial<T>) {
    const model = await this.model.upsert({ where, update: data, create: data });
    return model;
  }

  public async deleteById(id: string) {
    const model = await this.model.delete({ where: { id } });
    return model;
  }
}
