import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { ApiBody } from '@midwayjs/swagger';
import { BaseController } from '../../../core/base_controller';
import { Jwt } from '../../../util/jwt';
import { LoginDto } from '../dto/auth';
import { UserService } from '../service/user';

@Controller('/auth', { description: '授权管理' })
export class AuthController extends BaseController {
  @Inject()
  private jwt: Jwt;

  @Inject()
  private userService: UserService;

  @Post('/login', { description: '用户登录' })
  @ApiBody({ type: LoginDto })
  public async login(@Body() body) {
    const result = await this.userService.login(body);
    return this.success(result);
  }

  @Get('/info', { description: '获取登录信息' })
  public async getInfo() {
    const { id } = this.ctx.state.user;
    const { username, phone, nickname, avatar, role, status } = await this.userService.findById(id);
    const token = this.jwt.sign({ id, phone, username, role, status });
    return this.success({ token, user: { id, username, phone, nickname, avatar, role } });
  }
}
