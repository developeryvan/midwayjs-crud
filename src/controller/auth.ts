import { ALL, Body, Controller, Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { BaseController } from '../core/base_controller';
import { UserService } from '../service/user';
@Provide()
@Controller('/auth')
export class AuthController extends BaseController {
  @Inject() userService: UserService;
  @Post('/login')
  async login(@Body(ALL) body) {
    const result = await this.userService.login(body);
    this.success(result);
  }
  @Get('/getInfo')
  async getInfo() {
    const { _id } = this.ctx.state.user;
    const result = await this.userService.findById(_id);
    this.success(result);
  }
  @Post('/logout')
  async logout(@Body() token) {
    if (!token) token = this.ctx.state.token;
    const result = await this.userService.logout(token);
    this.success(result);
  }
}
