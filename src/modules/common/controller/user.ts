import { User } from '../model/user';
import { UserService } from '../service/user';
import { Crud } from '../../../decorator/crud';
import { CrudController } from '../../../core/base_controller';
import { Inject } from '@midwayjs/decorator';
@Crud('/user', { description: '用户管理' }, {})
export class UserController extends CrudController<User> {
  @Inject() protected service: UserService;
}
