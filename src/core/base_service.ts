import { Init, Inject } from '@midwayjs/decorator';
import { getModelForClass } from '@typegoose/typegoose';
import { ReturnModelType, AnyParamConstructor, DocumentType } from '@typegoose/typegoose/lib/types';
import { FilterQuery } from 'mongoose';

import Mongodb from './mongodb';
export class BaseService<T> {
  protected constructor(private readonly connectionName: string, private readonly uninitializedClass: AnyParamConstructor<T>) {}
  protected model: ReturnModelType<AnyParamConstructor<T>>;
  @Inject() private mongodb: Mongodb;
  @Init() async init() {
    this.model = getModelForClass(this.uninitializedClass, { existingConnection: this.mongodb.getConnection(this.connectionName) });
  }
  async findAll(filter): Promise<DocumentType<T>[]> {
    const models = await this.model.find(filter);
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
  async updateById(id: string, data): Promise<DocumentType<T>> {
    const model = await this.model.findByIdAndUpdate(id, data, { new: true });
    return model;
  }
  async deleteById(id: string): Promise<DocumentType<T>> {
    const model = await this.model.findByIdAndRemove(id);
    return model;
  }
}
