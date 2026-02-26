import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SendTelegramRawDto {
  @ApiProperty({ description: 'Raw message text to send to Telegram groups', example: '🔥 Yuk bor! Toshkent → Moskva...' })
  @IsString()
  @MinLength(1)
  message: string;
}
