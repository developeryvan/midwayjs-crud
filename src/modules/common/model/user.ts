import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseModel } from '../../../core/base_model';
@EntityModel()
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'user', timestamps: true } })
export class User {
  @prop() public avatar?: string;
  @prop() public nickname: string;
  @prop({ select: false }) public password: string;
  @prop() public phone: string;
  @prop({ default: 'user' }) public role: string;
  @prop() public status: boolean;
  @prop({ required: true, unique: true }) public username: string;
}
export type UserModel = BaseModel<DocumentType<User>>;
