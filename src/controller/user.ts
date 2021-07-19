import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Put, Query } from '@midwayjs/decorator';
import { BaseController } from '../core/base_controller';
import { UserService } from '../service/user';
@Provide()
@Controller('/user')
export class UserController extends BaseController {
  @Inject() userService: UserService;
  @Get('/')
  async index(@Query(ALL) query) {
    const result = await this.userService.findAllWithPaginate(query);
    this.success(result);
  }
  @Get('/:id')
  async show(@Param() id: string) {
    const result = await this.userService.findById(id);
    this.success(result);
  }
  @Post('/')
  async create(@Body(ALL) body) {
    const result = await this.userService.create(body);
    this.success(result);
  }
  @Put('/:id')
  async update(@Param() id: string, @Body(ALL) body) {
    const result = await this.userService.updateById(id, body);
    this.success(result);
  }
  @Del('/:id')
  async destroy(@Param() id: string) {
    const result = await this.userService.deleteById(id);
    this.success(result);
  }
}
