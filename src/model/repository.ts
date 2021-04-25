import { ModelOptions, prop } from '@typegoose/typegoose';
@ModelOptions({ schemaOptions: { collection: 'repository', timestamps: true } })
export class Repository {
  @prop({ required: true }) language: string;
  @prop({ required: true, unique: true }) name: string;
  @prop({ required: true }) url: string;
  @prop({ required: true }) description: string;
  @prop({ required: true }) star: string;
  @prop({ required: true }) lastPushedAt: Date;
}
