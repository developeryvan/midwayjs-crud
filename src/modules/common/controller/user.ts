import { Inject } from '@midwayjs/decorator';
import { BaseController } from '../../../core/base_controller';
import { Crud } from '../../../decorator/crud';
import { UserDto } from '../dto/user';
import { UserService } from '../service/user';

@Crud(
  '/user',
  { description: '用户管理' },
  { apis: ['index', 'show', 'create', 'update', 'destroy'], dto: { create: UserDto } },
)
export class UserController extends BaseController {
  @Inject()
  protected service: UserService;
}
