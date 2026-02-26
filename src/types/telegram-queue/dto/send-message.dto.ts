import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendTelegramMessageDto {
  @ApiProperty({ example: 'Hello groups!' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
