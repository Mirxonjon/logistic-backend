import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ description: '10-digit numeric login code', example: '1234567890' })
  @IsString()
  @Length(10, 10)
  @Matches(/^\d{10}$/)
  loginCode: string;
}
