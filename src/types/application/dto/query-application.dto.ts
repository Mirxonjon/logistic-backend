import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsIn,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetLogisticsMessagesDto {
  // Basic filters
  @ApiPropertyOptional({ example: 'Muzaffardanyuklar' })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiPropertyOptional({
    example: 'LOAD_POST',
    enum: ['LOAD_POST', 'REGULAR_MESSAGE'],
  })
  @IsOptional()
  @IsIn(['LOAD_POST', 'REGULAR_MESSAGE'])
  aiStatus?: 'LOAD_POST' | 'REGULAR_MESSAGE';

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActual?: boolean;

  @ApiPropertyOptional({ example: 'TRUE', enum: ['TRUE', 'FALSE'] })
  @IsOptional()
  @IsIn(['TRUE', 'FALSE'])
  isComplete?: 'TRUE' | 'FALSE';

  // Route filters
  @ApiPropertyOptional({ example: 'UZ' })
  @IsOptional()
  @IsString()
  countryFrom?: string;

  @ApiPropertyOptional({ example: 'TASHKENT' })
  @IsOptional()
  @IsString()
  regionFrom?: string;

  @ApiPropertyOptional({ example: 'KZ' })
  @IsOptional()
  @IsString()
  countryTo?: string;

  @ApiPropertyOptional({ example: 'ALMATY' })
  @IsOptional()
  @IsString()
  regionTo?: string;

  // Weight
  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weightMin?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weightMax?: number;

  // New filters
  @ApiPropertyOptional({ example: "Bug'doy yuklash" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'tons', enum: ['tons', 'pallet'] })
  @IsOptional()
  @IsIn(['tons', 'pallet'])
  cargoUnit?: 'tons' | 'pallet';

  @ApiPropertyOptional({ example: 'tent' })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiPropertyOptional({ example: 'cash', enum: ['cash', 'online', 'combo'] })
  @IsOptional()
  @IsIn(['cash', 'online', 'combo'])
  paymentType?: 'cash' | 'online' | 'combo';

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  paymentAmountMin?: number;

  @ApiPropertyOptional({ example: 3000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  paymentAmountMax?: number;

  @ApiPropertyOptional({ example: 'usd', enum: ['usd', 'sum'] })
  @IsOptional()
  @IsIn(['usd', 'sum'])
  paymentCurrency?: 'usd' | 'sum';

  @ApiPropertyOptional({
    example: 'YES',
    enum: ['YES', 'NO'],
    description: 'YES => advancePayment IS NOT NULL, NO => IS NULL',
  })
  @IsOptional()
  @IsIn(['YES', 'NO'])
  hasAdvancePayment?: 'YES' | 'NO';

  @ApiPropertyOptional({
    example: 1704067200000,
    description: 'UNIX ms timestamp',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pickupDateFrom?: number;

  @ApiPropertyOptional({
    example: 1706745599999,
    description: 'UNIX ms timestamp',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pickupDateTo?: number;

  @ApiPropertyOptional({
    example: 1704067200000,
    description: 'UNIX ms timestamp',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sentFrom?: number;

  @ApiPropertyOptional({
    example: 1706745599999,
    description: 'UNIX ms timestamp',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sentTo?: number;

  // Pagination
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  interval?: number;
}
