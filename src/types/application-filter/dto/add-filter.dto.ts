import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { FilterTypeEnum } from '@/types/global/constants';
import { FilterType } from '@/types/global/types';

export class FilterFieldDto {
  @ApiProperty({ description: 'Field ID' })
  @IsString()
  field_id: string;

  @ApiProperty({ description: 'Filter type', enum: FilterTypeEnum })
  @IsEnum(FilterTypeEnum)
  type: FilterType;

  @ApiProperty({ description: 'Filter options', required: false })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiProperty({ description: 'Whether the field is filtered' })
  @IsBoolean()
  is_filtered: boolean;

  @ApiProperty({ description: 'Whether the field is default' })
  @IsBoolean()
  is_default: boolean;
}

export class AddFilterDto {
  @ApiProperty({
    description: 'Array of filter fields',
    type: [FilterFieldDto],
  })
  @IsArray()
  filter: FilterFieldDto[];
}
