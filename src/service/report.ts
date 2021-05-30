import { Inject, Provide } from '@midwayjs/decorator';

import { BaseService } from '../core/base_service';
import { Report, ReportModel } from '../model/report';
@Provide()
export class ReportService extends BaseService<Report> {
  @Inject('reportModel') model: ReportModel;
}
