import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import { Report, ReportModel } from '../model/report';
@Provide()
export class ReportService extends BaseService<Report> {
  @InjectEntityModel(Report) protected model: ReportModel;
}
