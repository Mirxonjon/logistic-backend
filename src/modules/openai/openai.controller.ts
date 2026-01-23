import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { MessageAnalyseDto } from '@/types/openai';
import { ApiBody } from '@nestjs/swagger';

@Controller('ai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('ask')
  async ask(@Body('prompt') prompt: string) {
    const result = await this.openaiService.askGPT(prompt);
    return { result };
  }

  @Post('message')
  @ApiBody({ type: MessageAnalyseDto })
  async message(@Body() dto: MessageAnalyseDto) {
    const result = await this.openaiService.messageAnalyse(dto);
    return { result };
  }
}
