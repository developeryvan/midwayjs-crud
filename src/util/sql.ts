import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { PrismaClient } from '@prisma/client';
import * as sqlstring from 'sqlstring';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Sql {
  @Inject('prisma')
  private prismaClient: PrismaClient;

  public async bulkUpdate(table: string, columns: string[], body) {
    const first = `${table} (${columns.join(', ')})`;
    const second = sqlstring.escape(body);
    const third = columns.map((item) => `${item}=VALUES(${item})`).join(', ');
    const sql = `INSERT INTO ${first}
                 VALUES ${second} ON DUPLICATE KEY
                 UPDATE ${third};`;
    const result = await this.prismaClient.$executeRawUnsafe(sql);
    return result;
  }
}
