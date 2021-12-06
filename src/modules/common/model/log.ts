import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseModel } from '../../../core/base_model';
@EntityModel({ connectionName: 'log' })
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'log', timestamps: true } })
export class Log {
  @prop({ default: 'info' }) public type: string;
  @prop({ required: true }) public key: string;
  @prop() public description: string;
  @prop() public content: unknown;
}
export type LogModel = BaseModel<DocumentType<Log>>;
