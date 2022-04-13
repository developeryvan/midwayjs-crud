import { ApiProperty } from '@midwayjs/swagger';

export class LoginDto {
  @ApiProperty()
  public appid: string;

  @ApiProperty()
  public code: string;

  @ApiProperty()
  public method: string;

  @ApiProperty()
  public password: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public username: string;
}
