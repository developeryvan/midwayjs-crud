import { ApiProperty } from '@midwayjs/swagger';
import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseEntity } from '../../../core/base_entity';
import { BaseModel } from '../../../core/base_model';
@EntityModel()
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'user', timestamps: true } })
export class User extends BaseEntity {
  @ApiProperty()
  @prop({ required: true, unique: true })
  public username: string;
  @ApiProperty()
  @prop()
  public phone: string;
  @ApiProperty()
  @prop()
  public nickname: string;
  @ApiProperty()
  @prop({ select: false })
  public password: string;
  @ApiProperty()
  @prop()
  public avatar?: string;
  @ApiProperty()
  @prop({ default: 'user' })
  public role: string;
  @ApiProperty()
  @prop()
  public status: boolean;
}
export type UserModel = BaseModel<DocumentType<User>>;
