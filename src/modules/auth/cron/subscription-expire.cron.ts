import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class SubscriptionExpireCron {
  private readonly logger = new Logger(SubscriptionExpireCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleSubscriptionExpire() {
    const now = new Date();

    const result = await this.prisma.user.updateMany({
      where: {
        role: 'DISPATCHER',
        isActive: true,
        paymentDate: { not: null, lt: now },
      },
      data: { isActive: false },
    });

    if (result.count > 0) {
      this.logger.log(`Subscription cron: ${result.count} users deactivated`);
    } else {
      this.logger.log('Subscription cron: 0 users deactivated');
    }
  }
}
