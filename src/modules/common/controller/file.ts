import { Controller, Files, Headers, Post } from '@midwayjs/decorator';
import { rename } from 'fs/promises';
import { join } from 'path';
import { BaseController } from '../../../core/base_controller';

@Controller('/file', { description: '文件管理' })
export class FileController extends BaseController {
  @Post('/upload')
  public async upload(@Files() files, @Headers('host') host: string, @Headers('x-forwarded-proto') proto: string) {
    const result = await Promise.all(
      files.map(async (file) => {
        const filename = file.filename;
        await rename(file.data, join(this.app.getAppDir(), 'public', filename));
        return `${proto || 'http'}://${host}/public/${filename}`;
      }),
    );
    return this.success(result);
  }
}
