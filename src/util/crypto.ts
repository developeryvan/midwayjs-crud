import * as crypto from 'crypto';

import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

import Nacos from '../core/nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Crypto {
  @Inject() nacos: Nacos;
  encrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.nacos.getConfig('cipherKey') || Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  decrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.nacos.getConfig('cipherKey') || Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(str, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  md5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
  }
}
