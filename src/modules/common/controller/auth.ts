import { ALL, Body, Controller, Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { Jwt } from '../../../util/jwt';
import { LoginDto, LogoutDto } from '../dto/auth';
import { UserService } from '../service/user';
@Provide()
@Controller('/auth', { description: '授权管理' })
export class AuthController extends BaseController {
  @Inject() private readonly jwt: Jwt;
  @Inject() private readonly userService: UserService;
  @Get('/info', { description: '获取登录信息' })
  public async getInfo() {
    const { _id } = this.ctx.state.user;
    const user = await this.userService.findById(_id);
    delete this.ctx.state.user.iat;
    delete this.ctx.state.user.exp;
    const token = this.jwt.sign(this.ctx.state.user);
    this.success({ token, user });
  }
  @Post('/login', { description: '用户登录' })
  public async login(@Body(ALL) body: LoginDto) {
    const result = await this.userService.login(body);
    this.success(result);
  }
  @Post('/logout', { description: '用户登出' })
  public async logout(@Body(ALL) body: LogoutDto) {
    await this.jwt.revoke(body.token || this.ctx.state.token);
    this.success();
  }
}
