import { ModelOptions, plugin, prop, ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { MongodbConnection } from '../decorator/mongodb_connection';
@MongodbConnection('default')
@ModelOptions({ schemaOptions: { collection: 'user', timestamps: true } })
@plugin(mongoosePaginate)
export class User {
  @prop({ required: true, unique: true }) phone: string;
  @prop({ required: true, unique: true }) username: string;
  @prop({ required: true }) nickname: string;
  @prop({ required: true, select: false, minlength: 6 }) password: string;
  @prop({}) avatar?: string;
  @prop({ default: 'user' }) roles: string;
  @prop({ default: -1 }) status: number;
}
export type UserModel = PaginateModel<DocumentType<User>> & ReturnModelType<typeof User>;
