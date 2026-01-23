import { FilterTypeEnum, StatusWithArchiveEnum, StatusWithArchiveType } from '@/types/global';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateApplicationFilterDto {
  @ApiProperty({
    enum: StatusWithArchiveEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusWithArchiveEnum)
  status?: StatusWithArchiveType;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        field_id: { type: 'string' },
        type: { type: 'string', enum: Object.values(FilterTypeEnum) },
        options: { type: 'array', items: { type: 'string' } },
        is_filtered: { type: 'boolean' },
        is_default: { type: 'boolean', default: false },
      },
    },
  })
  @IsArray()
  @IsOptional()
  filter?: Array<{
    field_id: string;
    type: FilterTypeEnum;
    options?: Types.ObjectId[];
    is_filtered: boolean;
    is_default: boolean;
  }>;
}
