import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateTelegramGroupDto {
  @ApiProperty({ example: '@logistics_uz', description: 'Telegram group username starting with @' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^@/, { message: 'username must start with "@"' })
  @Expose()
  username!: string;

  @ApiProperty({ required: false, description: 'Readable title of the group' })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
}
