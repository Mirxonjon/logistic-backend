import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ description: 'Admin username', example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Admin password', example: 'P@ssw0rd' })
  @IsString()
  @MinLength(4)
  password: string;
}
