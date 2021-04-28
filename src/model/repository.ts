import { ModelOptions, prop } from '@typegoose/typegoose';
@ModelOptions({ schemaOptions: { collection: 'repository', timestamps: true } })
export class Repository {
  @prop({ required: true }) type: string;
  @prop({ required: true }) keyword: string;
  @prop({ required: true, unique: true }) name: string;
  @prop({ required: true }) url: string;
  @prop({ required: true }) description: string;
  @prop() language: string;
  @prop() star: number;
  @prop() lastPushedAt: Date;
}
