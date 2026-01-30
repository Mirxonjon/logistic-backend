import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TelegramGroupService } from './telegram-group.service';
import { CreateTelegramGroupDto } from '@/types/telegram-group';
import { UpdateTelegramGroupDto } from '@/types/telegram-group';
import { QueryTelegramGroupDto } from '@/types/telegram-group';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Telegram-groups')
@Controller('v1/telegram-groups')
export class TelegramGroupController {
  constructor(private readonly telegramGroupService: TelegramGroupService) {}

  @Get('by-id/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.telegramGroupService.findById(id);
  }

  @Post()
  @ApiBody({ type: CreateTelegramGroupDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTelegramGroupDto) {
    return this.telegramGroupService.create(dto);
  }

  @Get()
  async findAll(@Query() query: QueryTelegramGroupDto) {
    return this.telegramGroupService.findAll(query);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTelegramGroupDto) {
    return this.telegramGroupService.update(id, dto);
  }

  @Delete(':id')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.telegramGroupService.deactivate(id);
  }
}
