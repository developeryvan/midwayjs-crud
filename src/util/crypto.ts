import * as crypto from 'crypto';
import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Crypto {
  @Config('keys')
  private readonly cipherKey: string;

  public decrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.cipherKey || Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(str, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public decryptMiniprogramData(encrypt: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'base64'));
    decipher.setAutoPadding(true);
    let decoded = decipher.update(Buffer.from(encrypt, 'base64') as unknown as string, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  }

  public encrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.cipherKey || Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  public md5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
  }
}
