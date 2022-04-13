/* eslint-disable no-case-declarations */
import { Inject, Provide } from '@midwayjs/decorator';
import { PrismaClient, User } from '@prisma/client';
import { BaseService } from '../../../core/base_service';
import { Crypto } from '../../../util/crypto';
import { Jwt } from '../../../util/jwt';

@Provide()
export class UserService extends BaseService<User> {
  @Inject()
  private crypto: Crypto;

  @Inject()
  private jwt: Jwt;

  @Inject('prisma')
  private prismaClient: PrismaClient;

  protected get model() {
    return this.prismaClient.user;
  }

  public async create(data: User) {
    const { phone, username, nickname, password = '986532' } = data;
    if (!phone && !username) {
      throw new Error('用户名和手机号不能同时为空');
    }
    const existModel = await this.model.count({ where: { OR: [{ phone }, { username }] } });
    if (existModel) {
      throw new Error('用户已存在');
    }
    const encryptPassword = this.crypto.encrypt(password);
    Object.assign(data, {
      username: username || phone,
      nickname: nickname || username || phone,
      password: encryptPassword,
    });
    const model = await this.model.create({ data });
    return Object.assign(model, { password: null });
  }

  public async login(body) {
    const { method = 'password', phone, username, password, appid, code } = body;
    let model: User;
    switch (method) {
      case 'password':
        const encryptPassword = this.crypto.encrypt(password);
        model = await this.model.findFirst({
          where: {
            OR: [
              { phone, password: encryptPassword },
              { username, password: encryptPassword },
            ],
          },
        });
        break;
    }
    if (!model?.status) {
      throw new Error('登录错误');
    }
    return this.jwt.sign({
      id: model.id,
      phone: model.phone,
      username: model.username,
      role: model.role,
      status: model.status,
    });
  }
}
