import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({ description: 'Full name of the user', example: 'John Doe' })
  @IsOptional()
  @IsString()
  fullName?: string;
}
