import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostsController } from './logistics-message.controller';
import { PostsService } from './logistics-message.service';

import { TelegramModule } from '@/external/telegram/telegram.module';
import { OpenaiModule } from '../openai/openai.module';
import { LogisticsGatewayModule } from '../notification-gateway/notifications-gateway.module';

@Module({
  imports: [
    forwardRef(() => LogisticsGatewayModule),
    forwardRef(() => TelegramModule),
    OpenaiModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
