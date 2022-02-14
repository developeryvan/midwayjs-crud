import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseEntity } from '../../../core/base_entity';
import { BaseModel } from '../../../core/base_model';

@EntityModel()
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'report', timestamps: true } })
export class Report extends BaseEntity {
  @prop({ required: true })
  public url: string;

  @prop({ required: true })
  public ip: string;

  @prop({ required: true })
  public method: string;

  @prop()
  public body: string;

  @prop()
  public response: string;

  @prop()
  public responseTime: number;
}

export type ReportModel = BaseModel<DocumentType<Report>>;
