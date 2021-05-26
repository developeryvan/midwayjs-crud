import { IMidwayContainer, providerWrapper, ScopeEnum } from '@midwayjs/core';
import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

import Mongodb from '../core/mongodb';
@ModelOptions({ schemaOptions: { collection: 'user', timestamps: true } })
export class User {
  @prop({ required: true, unique: true }) phone: string;
  @prop({ required: true, unique: true }) username: string;
  @prop({ required: true }) nickname: string;
  @prop({ required: true, select: false, minlength: 6 }) password: string;
  @prop({}) avatar?: string;
  @prop({ default: 'user' }) roles: string;
  @prop({ default: -1 }) status: number;
}
export async function factory(container: IMidwayContainer) {
  const mongodb = await container.getAsync<Mongodb>('mongodb');
  const mainConnection = mongodb.getConnection('main');
  const model = getModelForClass(User, { existingConnection: mainConnection });
  return model;
}
providerWrapper([{ id: 'userModel', provider: factory, scope: ScopeEnum.Singleton }]);
export type UserModel = ReturnModelType<typeof User>;
