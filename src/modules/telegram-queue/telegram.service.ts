import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramQueueService {
  private readonly logger = new Logger(TelegramQueueService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @InjectQueue('telegram-queue') private readonly queue: Queue
  ) {}

  async enqueueMessage(message: string, requestedBy?: number) {
    const usernames = await this.getActiveGroupUsernames();

    const job = await this.queue.add(
      'send-message',
      {
        message,
        groups: usernames,
        requestedBy: requestedBy ?? null,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return { jobId: job.id };
  }

  async getActiveGroupUsernames(): Promise<string[]> {
    const groups = await this.prisma.telegramGroup.findMany({
      where: { isActive: true },
      select: { username: true },
    });

    return groups
      .map((g) => g.username)
      .filter((u): u is string => !!u && u.trim().length > 0)
      .map((u) => (u.startsWith('@') ? u : `@${u}`));
  }

  async sendToPythonTelegramApi(payload: {
    message: string;
    groups: string[];
    requestedBy: string;
  }): Promise<void> {
    const baseUrl = 'http://127.0.0.1:8000';

    if (!baseUrl) {
      throw new Error('Python service URL is not configured');
    }
    const url = `${baseUrl.replace(/\/$/, '')}/mtproto/send`;
    await axios.post(url, payload);
  }
}
