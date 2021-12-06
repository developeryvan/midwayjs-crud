import { Controller, Get } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
@Controller('/home')
export class HomeController extends BaseController {
  @Get('/')
  public async render() {
    await this.ctx.render('home.nj', { user: 'Yvan' });
  }
}
