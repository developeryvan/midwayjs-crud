import { EntityModel } from '@midwayjs/typegoose';
import { DocumentType, ModelOptions, plugin, prop } from '@typegoose/typegoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { BaseModel } from '../../../core/base_model';
@EntityModel()
@plugin(mongoosePaginate)
@ModelOptions({ schemaOptions: { collection: 'github_repository', timestamps: true } })
export class GithubRepository {
  @prop({ required: true }) public type: string;
  @prop({ required: true }) public keyword: string;
  @prop({ required: true, unique: true }) public name: string;
  @prop({ required: true }) public url: string;
  @prop({ required: true }) public description: string;
  @prop() public language: string;
  @prop() public star: number;
  @prop() public lastPushedAt: Date;
}
export type GithubRepositoryModel = BaseModel<DocumentType<GithubRepository>>;
