import * as crypto from 'crypto';

import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Crypto {
  @Config('cipherKey') cipherKey;
  encrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.cipherKey || Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  decrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.cipherKey || Buffer.alloc(16, 0);
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
