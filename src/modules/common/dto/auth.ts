import { ApiProperty } from '@midwayjs/swagger';

export class LoginDto {
  @ApiProperty()
  public password: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public username: string;
}

export class LogoutDto {
  @ApiProperty()
  public token: string;
}
