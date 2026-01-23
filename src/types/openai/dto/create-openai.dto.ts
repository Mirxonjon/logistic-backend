import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MessageAnalyseDto {
  @ApiProperty({
    description: 'Analiz qilinadigan matn',
    example: 'Bugun havo juda yaxshi',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
