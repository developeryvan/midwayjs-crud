import { AnyParamConstructor, DocumentType, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { PaginateModel, FilterQuery, ModelUpdateOptions, QueryFindOptions, PaginateOptions, PaginateResult, UpdateQuery } from 'mongoose';
export class BaseService<T> {
  protected model: PaginateModel<DocumentType<T>> & ReturnModelType<AnyParamConstructor<T>>;
  async findAllWithPaginate(filter: FilterQuery<DocumentType<T>>, options?: PaginateOptions): Promise<PaginateResult<DocumentType<T>>> {
    const models = await this.model.paginate(filter, options);
    return models;
  }
  async findAll(filter: FilterQuery<DocumentType<T>>, projection?, options?: QueryFindOptions): Promise<DocumentType<T>[]> {
    const models = await this.model.find(filter, projection, options);
    return models;
  }
  async findOne(filter: FilterQuery<DocumentType<T>>): Promise<DocumentType<T>> {
    const model = await this.model.findOne(filter);
    return model;
  }
  async findById(id: string): Promise<DocumentType<T>> {
    const model = await this.model.findById(id);
    return model;
  }
  async create(data): Promise<DocumentType<T>> {
    const model = await this.model.create(data);
    return model;
  }
  async update(filter: FilterQuery<DocumentType<T>>, data: UpdateQuery<DocumentType<T>>, options: ModelUpdateOptions): Promise<DocumentType<T>> {
    const model = await this.model.updateMany(filter, data, options);
    return model;
  }
  async updateById(id: string, data): Promise<DocumentType<T>> {
    const model = await this.model.findByIdAndUpdate(id, data, { new: true });
    return model;
  }
  async deleteById(id: string): Promise<DocumentType<T>> {
    const model = await this.model.findByIdAndRemove(id);
    return model;
  }
}
