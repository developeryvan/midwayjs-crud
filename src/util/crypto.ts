import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as crypto from 'crypto';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Crypto {
  @Config('keys')
  private cipherKey: string;

  public get base() {
    return crypto;
  }

  public aes256EcbDecrypt(encrypted, key) {
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public aes256gcmDecrypt(key: string, nonce: string, associatedData: string, ciphertext: string): string {
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
    const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
    const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);
    const decipherIv = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipherIv.setAuthTag(Buffer.from(authTag));
    decipherIv.setAAD(Buffer.from(associatedData));
    const decryptStr = decipherIv.update(data, null, 'utf8');
    decipherIv.final();
    return decryptStr;
  }

  public miniprogramDataDecrypt(encrypt: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'base64'));
    decipher.setAutoPadding(true);
    let decoded = decipher.update(Buffer.from(encrypt, 'base64') as unknown as string, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  }

  public decrypt(str: string, cipherKey?: string): string {
    const key = cipherKey || this.cipherKey || Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(str, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
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

  public sha1(str: string) {
    return crypto.createHash('sha1').update(str).digest('hex');
  }

  public sha256WithRsa(str: string, privatekey: string | Buffer): string {
    return crypto.createSign('RSA-SHA256').update(str).sign(privatekey, 'base64');
  }
}
