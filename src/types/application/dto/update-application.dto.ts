import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsObject,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLogisticMessageDto {
  @ApiPropertyOptional()
  text?: string;

  @ApiPropertyOptional()
  date?: string;

  @ApiPropertyOptional()
  views?: number;

  @ApiPropertyOptional()
  aiStatus?: 'KEEP' | 'SKIP';

  @ApiPropertyOptional()
  structured?: any;

  @ApiPropertyOptional()
  isActual?: boolean;
}
