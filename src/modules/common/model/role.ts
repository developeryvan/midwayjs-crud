import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseEntity } from '../../../core/base_entity';
import { BaseModel } from '../../../core/base_model';

@EntityModel()
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'role', timestamps: true } })
export class Role extends BaseEntity {
  @prop({ required: true, unique: true })
  public roleId: string;

  @prop({ required: true, unique: true })
  public roleName: string;

  @prop()
  public status: boolean;
}

export type RoleModel = BaseModel<DocumentType<Role>>;
