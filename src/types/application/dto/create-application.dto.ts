import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLogisticMessageDto {
  @ApiProperty({
    example: 26443,
    description: 'Telegram xabarning unikal IDsi (message.id)',
  })
  @IsNumber()
  tgMessageId: number;

  @ApiProperty({
    example: 'Muzaffardanyuklar',
    description: 'Telegram kanal nomi',
  })
  @IsString()
  channelName: string;

  @ApiProperty({
    example:
      'Toshkent → Andijon 20 tonna un uchun tent kerak. Nakd. 99890xxxxxxx',
    description: 'Xabar matni (to‘liq text)',
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: '2025-12-12T11:38:52+00:00',
    required: false,
    description: 'Telegram xabarning yaratilgan vaqti (ISO format)',
  })
  @IsOptional()
  date?: string;

  @ApiProperty({
    example: 1234,
    required: false,
    description: 'Telegram xabar ko‘rishlar soni (views)',
  })
  @IsOptional()
  views?: number | null;
}
