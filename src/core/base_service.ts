import { DocumentType } from '@typegoose/typegoose/lib/types';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { BaseModel, PaginateOptions, PaginateResult } from './base_model';
export class BaseService<T> {
  protected model: BaseModel<DocumentType<T>>;

  public async create(data: T): Promise<DocumentType<T>> {
    return this.model.create(data);
  }

  public async deleteById(id: string): Promise<DocumentType<T>> {
    return this.model.findByIdAndRemove(id);
  }

  public async findAll(filter: FilterQuery<DocumentType<T>>, projection?, options?: QueryOptions): Promise<DocumentType<T>[]> {
    return this.model.find(filter, projection, options);
  }

  public async findAllWithPaginate(filter: FilterQuery<DocumentType<T>>, options?: PaginateOptions): Promise<PaginateResult<DocumentType<T>>> {
    return this.model.paginate(filter, options);
  }

  public async findById(id: string, projection?, options?: QueryOptions): Promise<DocumentType<T>> {
    return this.model.findById(id, projection, options);
  }

  public async findOne(filter: FilterQuery<DocumentType<T>>, projection?, options?: QueryOptions): Promise<DocumentType<T>> {
    return this.model.findOne(filter, projection, options);
  }

  public async updateById(id: string, update: UpdateQuery<DocumentType<T>>, options?: QueryOptions): Promise<DocumentType<T>> {
    return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
  }
}
