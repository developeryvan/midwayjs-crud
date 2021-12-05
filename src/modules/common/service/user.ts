import { Init, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import { Crypto } from '../../../util/crypto';
import { Jwt } from '../../../util/jwt';
import { User, UserModel } from '../model/user';
@Provide()
export class UserService extends BaseService<User> {
  @Inject() private readonly crypto: Crypto;
  @Inject() private readonly jwt: Jwt;

  @InjectEntityModel(User) protected model: UserModel;

  @Init()
  public async init(): Promise<void> {
    const existModel = await this.model.countDocuments({ username: 'admin' });
    if (!existModel) {
      await this.model.create({
        username: 'admin',
        phone: '13189981025',
        password: this.crypto.encrypt('123456'),
        role: 'admin',
        status: true,
      });
    }
  }

  public async create(body: User) {
    const { phone, username, nickname, password } = body;
    const existModel = await this.model.countDocuments({ phone });
    if (existModel) throw { message: 'the user already exists' };
    const encryptPassword = this.crypto.encrypt(password);
    const data = Object.assign(body, {
      username: username || phone,
      nickname: nickname || phone,
      password: encryptPassword,
    });
    const model = await this.model.create(data);
    return Object.assign(model, { password: null });
  }

  public async login(body: { phone?: string; username?: string; password: string }) {
    const { phone = '', username = '' } = body;
    const password = this.crypto.encrypt(body.password);
    const model = await this.model.findOne({
      $or: [
        { phone, password, status: true },
        { username, password, status: true },
      ],
    });
    if (!model) throw { message: 'login failed' };
    return this.jwt.sign({
      _id: model._id,
      phone: model.phone,
      username: model.username,
      role: model.role,
      status: model.status,
    });
  }
}
