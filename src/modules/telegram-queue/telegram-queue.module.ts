import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { TelegramQueueService } from './telegram.service';
import { TelegramQueueController } from './telegram.controller';
import { TelegramProcessor } from './telegram.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
          ? parseInt(process.env.REDIS_PORT, 10)
          : 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'telegram-queue',
    }),
    PrismaModule,
  ],
  controllers: [TelegramQueueController],
  providers: [TelegramQueueService, TelegramProcessor],
  exports: [TelegramQueueService],
})
export class TelegramQueueModule {}
