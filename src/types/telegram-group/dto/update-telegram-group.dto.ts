import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTelegramGroupDto {
  @ApiProperty({ required: false, description: 'Readable title of the group' })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
}
