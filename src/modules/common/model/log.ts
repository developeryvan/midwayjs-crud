import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseModel } from '../../../core/base_model';
@EntityModel({ connectionName: 'log' })
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'log', timestamps: true } })
export class Log {
  @prop() public content: unknown;
  @prop() public description: string;
  @prop({ required: true }) public key: string;
  @prop({ default: 'info' }) public type: string;
}
export type LogModel = BaseModel<DocumentType<Log>>;
