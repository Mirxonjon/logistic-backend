import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { openAIConfig, CONFIG_OPENAI_TOKEN } from '@/common/config/app.config';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Module({
  imports: [
    ConfigModule.forFeature(openAIConfig), // 🟢 configni modulga yuklash
  ],
  providers: [
    {
      provide: CONFIG_OPENAI_TOKEN, // 🟢 provider yaratish
      useFactory: (config: ConfigService) => config.get(CONFIG_OPENAI_TOKEN),
      inject: [ConfigService],
    },
    OpenaiService,
  ],
    exports: [OpenaiService],
  controllers: [OpenaiController],
})
export class OpenaiModule {}
