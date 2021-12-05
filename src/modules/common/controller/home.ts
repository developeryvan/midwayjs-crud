import { Controller, Get, Provide } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';

@Provide()
@Controller('/')
export class HomeController extends BaseController {
  @Get('/')
  public async render() {
    await this.ctx.render('home.nj', { user: 'Yvan' });
  }
}
