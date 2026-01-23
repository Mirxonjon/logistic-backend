import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogisticsGateway } from './notification-gateway.gateway';
import { PostsModule } from '../logistics-message/logistics-message.module';
import { SocketService } from './notification-gateway.service';

@Module({
  imports: [ConfigModule, forwardRef(() => PostsModule)],
  providers: [LogisticsGateway, SocketService],
  exports: [LogisticsGateway],
})
export class LogisticsGatewayModule {}
