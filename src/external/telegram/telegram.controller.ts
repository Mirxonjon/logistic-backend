import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegram: TelegramService) {}

  @Get('test')
  async test() {
    return this.telegram.sendToGroup('<b>Test message</b> 🚀');
  }
}
