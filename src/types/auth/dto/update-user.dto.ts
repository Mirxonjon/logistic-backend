import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Full name of the user', example: 'Jane Smith' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Is user active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
