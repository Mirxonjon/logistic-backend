import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiPropertyOptional({ description: 'Full name of the admin', example: 'Alice Admin' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'Unique admin username', example: 'admin.super' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Admin password (will be hashed)', example: 'Str0ngP@ssw0rd!' })
  @IsString()
  @MinLength(4)
  password: string;
}
