import { ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';
@ModelOptions({ schemaOptions: { collection: 'report', timestamps: true } })
export class Report {
  @prop({ required: true }) ip: string;
  @prop({ required: true }) url: string;
  @prop({ required: true }) method: string;
  @prop() body: string;
  @prop() response: string;
  @prop({ required: true }) responseTime: number;
}
export type ReportModel = ReturnModelType<typeof Report>;
