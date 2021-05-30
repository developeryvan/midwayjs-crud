import { Inject, Provide } from '@midwayjs/decorator';

import { BaseService } from '../core/base_service';
import { User, UserModel } from '../model/user';
import { Crypto } from '../util/crypto';
import { Jwt } from '../util/jwt';
@Provide()
export class UserService extends BaseService<User> {
  @Inject('userModel') model: UserModel;
  @Inject() crypto: Crypto;
  @Inject() jwt: Jwt;
  async create(body: User) {
    const { phone, username, nickname, password } = body;
    const existModel = await this.model.countDocuments({ phone });
    if (existModel) throw { message: 'the user already exists' };
    const encryptPassword = this.crypto.encrypt(password);
    const data = Object.assign(body, { username: username || phone, nickname: nickname || phone, password: encryptPassword });
    const model = await this.model.create(data);
    return Object.assign(model, { password: null });
  }
  async login(body: User) {
    const { phone = '', username = '' } = body;
    const password = this.crypto.encrypt(body.password);
    const model = await this.model.findOne({
      $or: [
        { phone, password, status: 0 },
        { username, password, status: 0 },
      ],
    });
    if (!model) throw { message: 'login failed' };
    const token = this.jwt.sign({ _id: model._id, phone: model.phone, username: model.username, status: model.status });
    return token;
  }
  async logout(token: string) {
    this.jwt.revoke(token);
  }
}
