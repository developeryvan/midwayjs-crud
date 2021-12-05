import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseModel } from '../../../core/base_model';
@EntityModel()
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'report', timestamps: true } })
export class Report {
  @prop() public body: string;
  @prop({ required: true }) public ip: string;
  @prop({ required: true }) public method: string;
  @prop() public response: string;
  @prop() public responseTime: number;
  @prop({ required: true }) public url: string;
}
export type ReportModel = BaseModel<DocumentType<Report>>;
