import { AnyParamConstructor, DocumentType, ReturnModelType } from '@typegoose/typegoose/lib/types';
import {
  CreateQuery,
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  QueryFindBaseOptions,
  QueryFindOneAndUpdateOptions,
  QueryFindOptions,
  UpdateQuery,
} from 'mongoose';
export class BaseService<T> {
  protected model: PaginateModel<DocumentType<T>> & ReturnModelType<AnyParamConstructor<T>>;
  async findAllWithPaginate(filter: FilterQuery<DocumentType<T>>, options?: PaginateOptions): Promise<PaginateResult<DocumentType<T>>> {
    const models = await this.model.paginate(filter, options);
    return models;
  }
  async findAll(filter: FilterQuery<DocumentType<T>>, projection = null, options?: QueryFindOptions): Promise<DocumentType<T>[]> {
    const models = await this.model.find(filter, projection, options);
    return models;
  }
  async findOne(filter: FilterQuery<DocumentType<T>>, projection = null, options?: QueryFindBaseOptions): Promise<DocumentType<T>> {
    const model = await this.model.findOne(filter, projection, options);
    return model;
  }
  async findById(id: string, projection = null, options?: QueryFindBaseOptions): Promise<DocumentType<T>> {
    const model = await this.model.findById(id, projection, options);
    return model;
  }
  async create(data: CreateQuery<DocumentType<T>>): Promise<DocumentType<T>> {
    const model = await this.model.create(data);
    return model;
  }
  async updateById(id: string, update: UpdateQuery<DocumentType<T>>, options: QueryFindOneAndUpdateOptions): Promise<DocumentType<T>> {
    options.new = true;
    const model = await this.model.findByIdAndUpdate(id, update, options);
    return model;
  }
  async deleteById(id: string): Promise<DocumentType<T>> {
    const model = await this.model.findByIdAndRemove(id);
    return model;
  }
}
