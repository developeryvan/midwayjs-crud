import { IMidwayContainer, providerWrapper, ScopeEnum } from '@midwayjs/core';
import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

import Mongodb from '../core/mongodb';
@ModelOptions({ schemaOptions: { collection: 'report', timestamps: true } })
export class Report {
  @prop({ required: true }) ip: string;
  @prop({ required: true }) url: string;
  @prop({ required: true }) method: string;
  @prop() body: string;
  @prop() response: string;
  @prop({ required: true }) responseTime: number;
}
export async function factory(container: IMidwayContainer) {
  const mongodb = await container.getAsync<Mongodb>('mongodb');
  const mainConnection = mongodb.getConnection('main');
  const model = getModelForClass(Report, { existingConnection: mainConnection });
  return model;
}
providerWrapper([{ id: 'reportModel', provider: factory, scope: ScopeEnum.Singleton }]);
export type ReportModel = ReturnModelType<typeof Report>;
