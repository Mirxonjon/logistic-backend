import { Module } from '@nestjs/common';
import { TelegramGroupService } from './telegram-group.service';
import { TelegramGroupController } from './telegram-group.controller';
import { PrismaModule } from '@/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TelegramGroupService],
  controllers: [TelegramGroupController],
  exports: [TelegramGroupService],
})
export class TelegramGroupModule {}
