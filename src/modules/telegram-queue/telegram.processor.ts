import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { TelegramQueueService } from './telegram.service';

@Processor('telegram-queue')
export class TelegramProcessor extends WorkerHost {
  private readonly logger = new Logger(TelegramProcessor.name);

  constructor(
    @Inject(TelegramQueueService)
    private readonly telegramService: TelegramQueueService,
  ) {
    super();
  }

  async process(
    job: Job<{
      message: string;
      groups: string[];
      requestedBy: number | null;
    }>,
  ): Promise<void> {
    const { message, groups, requestedBy } = job.data;

    this.logger.log(
      `Job ${job.id} started. RequestedBy: ${requestedBy ?? 'system'}. Groups: ${groups.length}`,
    );

    try {
      await this.telegramService.sendToPythonTelegramApi({
        message,
        groups,
        requestedBy: String(requestedBy ?? 'system'),
      });
      this.logger.log(`Job ${job.id} delivered to Python service`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Python service delivery failed: ${err.message}`);
      throw error;
    }

    this.logger.log(`Job ${job.id} completed`);
  }
}
