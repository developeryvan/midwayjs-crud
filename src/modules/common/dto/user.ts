import { ApiProperty } from '@midwayjs/swagger';

export class UserDto {
  @ApiProperty()
  public page: number;

  @ApiProperty()
  public limit: number;

  @ApiProperty()
  public sort: number;

  @ApiProperty()
  public id: number;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty()
  public status: boolean;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public nickname: string;

  @ApiProperty()
  public password: string;

  @ApiProperty()
  public avatar: string;

  @ApiProperty()
  public role: string;
}
