import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsBoolean } from 'class-validator';

export class FilterStatusDto {
  @ApiProperty({ description: 'Field ID' })
  @IsString()
  field_id: string;

  @ApiProperty({ description: 'Whether the field is filtered' })
  @IsBoolean()
  is_filtered: boolean;
}

export class UpdateFilterStatusDto {
  @ApiProperty({
    description: 'Array of filter statuses',
    type: [FilterStatusDto],
  })
  @IsArray()
  filters: FilterStatusDto[];
}
