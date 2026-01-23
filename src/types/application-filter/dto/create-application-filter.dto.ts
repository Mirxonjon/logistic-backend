import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FilterTypeEnum } from '@/types/global';
import { Types } from 'mongoose';

export class CreateApplicationFilterDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  application_form_id?: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({
    type: 'array',
    required: false,
    default: [],
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
