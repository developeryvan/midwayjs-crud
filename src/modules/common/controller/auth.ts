import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { Jwt } from '../../../util/jwt';
import { LoginDto, LogoutDto } from '../dto/auth';
import { UserService } from '../service/user';
@Controller('/auth', { description: '授权管理' })
export class AuthController extends BaseController {
  @Inject() private readonly jwt: Jwt;
  @Inject() private readonly userService: UserService;
  @Post('/login', { description: '用户登录' })
  public async login(@Body() body: LoginDto) {
    const result = await this.userService.login(body);
    return this.success(result);
  }
  @Get('/info', { description: '获取登录信息' })
  public async getInfo() {
    const { _id } = this.ctx.state.user;
    const user = await this.userService.findById(_id);
    delete this.ctx.state.user.iat;
    delete this.ctx.state.user.exp;
    const token = this.jwt.sign(this.ctx.state.user);
    return this.success({ token, user });
  }
  @Post('/logout', { description: '用户登出' })
  public async logout(@Body() body: LogoutDto) {
    await this.jwt.revoke(body.token || this.ctx.state.token);
    return this.success();
  }
}
