import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryTelegramGroupDto {
  @ApiPropertyOptional({
    description: 'Search by username (contains, case-insensitive)',
    example: 'logistics',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Search by title (contains)',
    example: 'Logistics',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'TRUE', enum: ['TRUE', 'FALSE'] })
  @IsOptional()
  @IsIn(['TRUE', 'FALSE'])
  isActive?: 'TRUE' | 'FALSE';


  @ApiPropertyOptional({
    description: 'Page number (default 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page (default 10)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
