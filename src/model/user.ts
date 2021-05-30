import { ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

import { MongodbConnection } from '../decorator/mongodb_connection';
@MongodbConnection('main')
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
export type UserModel = ReturnModelType<typeof User>;
