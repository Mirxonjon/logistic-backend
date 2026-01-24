import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetLogisticsMessagesDto {
  // =====================
  // 📡 BASIC FILTERS
  // =====================

  @ApiPropertyOptional({ example: 'Muzaffardanyuklar' })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiPropertyOptional({
    example: 'LOAD_POST',
    enum: ['LOAD_POST', 'REGULAR_MESSAGE'],
  })
  @IsOptional()
  @IsEnum(['LOAD_POST', 'REGULAR_MESSAGE'])
  aiStatus?: 'LOAD_POST' | 'REGULAR_MESSAGE';

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActual?: boolean;

  @ApiPropertyOptional({
    example: 'TRUE',
    enum: ['TRUE', 'FALSE'],
  })
  @IsOptional()
  @IsEnum(['TRUE', 'FALSE'])
  isComplete?: 'TRUE' | 'FALSE';

  // =====================
  // 📍 ROUTE FILTERS
  // =====================

  @ApiPropertyOptional({ example: 'UZ' })
  @IsOptional()
  @IsString()
  countryFrom?: string;

  @ApiPropertyOptional({ example: 'TASHKENT' })
  @IsOptional()
  @IsString()
  regionFrom?: string;

  @ApiPropertyOptional({ example: 'KZ' })
  @IsOptional()
  @IsString()
  countryTo?: string;

  @ApiPropertyOptional({ example: 'ALMATY' })
  @IsOptional()
  @IsString()
  regionTo?: string;

  // =====================
  // ⚖️ WEIGHT RANGE (real modelga mos)
  // =====================

  @ApiPropertyOptional({ example: 20, description: 'Minimal weight (tonna)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weightMin?: number;

  @ApiPropertyOptional({ example: 25, description: 'Maksimal weight (tonna)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weightMax?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  interval?: number;
}
