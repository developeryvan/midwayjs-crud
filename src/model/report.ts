import { ModelOptions, prop, ReturnModelType, DocumentType, plugin } from '@typegoose/typegoose';
import { PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { MongodbConnection } from '../decorator/mongodb_connection';
@MongodbConnection('log')
@ModelOptions({ schemaOptions: { collection: 'report', timestamps: true } })
@plugin(mongoosePaginate)
export class Report {
  @prop({ required: true }) ip: string;
  @prop({ required: true }) url: string;
  @prop({ required: true }) method: string;
  @prop() body: string;
  @prop() response: string;
  @prop({ required: true }) responseTime: number;
}
export type ReportModel = PaginateModel<DocumentType<Report>> & ReturnModelType<typeof Report>;
