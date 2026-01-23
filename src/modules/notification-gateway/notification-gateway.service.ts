import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { PostsService } from '../logistics-message/logistics-message.service';

@Injectable()
export class SocketService {
  constructor(
    // private readonly openai: OpenaiService,
    @Inject(forwardRef(() => PostsService))
    private readonly driverPost: PostsService
  ) {}

  async processTelegramMessage(data: any) {
    // const text = message.text?.toLowerCase() || '';

    const driverPost = await this.driverPost.create({
      tgMessageId: data.tgMessageId,
      channelName: data.channelName,
      text: data.text,
      date: data.date,
      views: data.views,
    });
    console.log(driverPost);
  }
}
