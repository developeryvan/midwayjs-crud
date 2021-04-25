import { Provide } from '@midwayjs/decorator';

import { BaseService } from '../core/base_service';
import { Report } from '../model/report';
@Provide()
export class ReportService extends BaseService<Report> {
  constructor() {
    super('log', Report);
  }
}
