import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop, Severity } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseEntity } from '../../../core/base_entity';
import { BaseModel } from '../../../core/base_model';
@EntityModel({ connectionName: 'log' })
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'log', timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class Log extends BaseEntity {
  @prop({ default: 'info' }) public type: string;
  @prop({ required: true }) public key: string;
  @prop() public description: string;
  @prop() public content: unknown;
}
export type LogModel = BaseModel<DocumentType<Log>>;
