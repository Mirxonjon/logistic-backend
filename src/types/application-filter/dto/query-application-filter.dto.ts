import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusWithArchiveEnum } from '@/types/global';
import { Transform } from 'class-transformer';
import { StatusWithArchiveType } from '@/types/global';
import { ListQueryDto } from '@/types/global/dto/list-query.dto';

export class QueryApplicationFilterDto extends ListQueryDto {
  @ApiProperty({
    enum: StatusWithArchiveEnum,
    description:
      'Filter by status (1=Active, 0=Inactive, -1=Archive). You can pass a single value or multiple.',
    required: false,
    isArray: true,
    example: [1, -1],
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => parseInt(v, 10));
    }
    return [Number(value)];
  })
  @IsOptional()
  @IsArray()
  @IsEnum(StatusWithArchiveEnum, { each: true })
  status?: StatusWithArchiveType[];

  @ApiProperty({
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  application_form_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsOptional()
  @IsBoolean()
  is_selected?: boolean;
}
