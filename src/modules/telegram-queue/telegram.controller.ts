import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { TelegramQueueService } from './telegram.service';
import { SendTelegramMessageDto } from '@/types/telegram-queue/dto/send-message.dto';

@ApiTags('Telegram')
@ApiBearerAuth()
@Controller('v1/telegram')
export class TelegramQueueController {
  constructor(private readonly telegramQueueService: TelegramQueueService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DISPATCHER')
  @ApiOperation({ summary: 'Send message to Telegram groups (async)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  })
  async send(@Body() body: SendTelegramMessageDto, @Req() req: any) {
    const user = (req as any)?.user;
    const { jobId } = await this.telegramQueueService.enqueueMessage(
      body.message,
      user?.userId,
    );
    return { jobId, status: 'queued' };
  }
}
