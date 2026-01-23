import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import {
  CreateLogisticMessageDto,
  GetLogisticsMessagesDto,
  UpdateLogisticMessageDto,
} from '@/types/application';

import { RequestWithUser } from '@/types/global';
import { application } from 'express';
import { TelegramService } from '@/external/telegram/telegram.service';
import { OpenaiService } from '../openai/openai.service';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogisticsGateway } from '../notification-gateway/notification-gateway.gateway';
import { classifyByRegex } from '@/common/utils/regex-classifier';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  private logger = new Logger(PostsService.name);

  constructor(
    @Inject(forwardRef(() => LogisticsGateway))
    private readonly gateway: LogisticsGateway,
    private readonly telegramService: TelegramService,
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService
  ) {}

  async create(data: CreateLogisticMessageDto): Promise<any> {
    const methodName: string = this.create.name;
    console.log(CreateLogisticMessageDto, 'data');

    this.logger.debug(
      `Method: ${methodName} - Request: ${JSON.stringify(data)}`
    );

    try {
      const { tgMessageId, channelName, text, date, views } = data;

      // 1️⃣ Xabar bazada bormi? (duplicate check)
      const existing = await this.prisma.logisticMessage.findFirst({
        where: {
          tgMessageId,
          channelName,
        },
      });

      if (existing) {
        throw new BadRequestException(
          `Xabar allaqachon mavjud: tgMessageId=${tgMessageId}, channel=${channelName}`
        );
      }

      const existingText = await this.prisma.logisticMessage.findFirst({
        where: {
          text: text,
        },
      });

      if (existingText) {
        throw new BadRequestException(
          `Xabar allaqachon mavjud: tgMessageId=${existingText.tgMessageId}, channel=${existingText.channelName}`
        );
      }
      const openaiResponse = await this.openaiService.messageAnalyse({
        message: text,
      });

      const baseData: Prisma.LogisticMessageCreateInput = {
        tgMessageId,
        channelName,
        text,
        date,
        views,
        aiStatus: openaiResponse.classifieredMessage.type,
        structured: openaiResponse,
        sentToTelegramAt: new Date(),
      };

      const isComplete = Boolean(
        openaiResponse?.route?.fromCountry &&
          openaiResponse?.route?.toCountry &&
          openaiResponse?.route?.fromRegion &&
          openaiResponse?.route?.toRegion
      );

      let fullData = baseData;

      if (openaiResponse.classifieredMessage.isLoad) {
        fullData = {
          ...baseData,

          countryFrom: openaiResponse?.route?.fromCountry,
          countryTo: openaiResponse?.route?.toCountry,

          regionFrom: openaiResponse?.route?.fromRegion,
          regionTo: openaiResponse?.route?.toRegion,

          title: openaiResponse?.metaData?.title,
          weight:
            openaiResponse?.metaData?.weight != null &&
            !isNaN(Number(openaiResponse.metaData.weight))
              ? Number(openaiResponse.metaData.weight)
              : undefined,
          cargoUnit: openaiResponse?.metaData?.cargoUnit,
          vehicleType: openaiResponse?.metaData?.vehicleType,

          paymentType: openaiResponse?.metaData?.paymentType,
          paymentAmount:
            openaiResponse?.metaData?.paymentAmount != null &&
            !isNaN(Number(openaiResponse.metaData.paymentAmount))
              ? Number(openaiResponse.metaData.paymentAmount)
              : undefined,
          advancePayment:
            openaiResponse?.metaData?.advancePayment != null &&
            !isNaN(Number(openaiResponse.metaData.advancePayment))
              ? Number(openaiResponse.metaData.advancePayment)
              : undefined,
          paymentCurrency: openaiResponse?.metaData?.paymentCurrency,

          pickupDate: await this.normalizePickupDate(
            openaiResponse.metaData?.pickupDate
          ),

          phoneNumber: openaiResponse.metaData?.phone_number,

          isComplete,
        };
      }

      const savedMessage = await this.prisma.logisticMessage.create({
        data: fullData,
      });

      if (!isComplete && openaiResponse.classifieredMessage.isLoad) {
        const postLink = `https://api.logistic-dev.coachingzona.uz/v1/post/${savedMessage.id}`;

        const incompleteMessageText = `
*Asl xabar:*
\`\`\`
${text}
\`\`\`

*Aniqlangan ma'lumotlar:*
\`\`\`
• From country: ${openaiResponse?.route?.fromCountry ?? '❌ yo‘q'}
• From region: ${openaiResponse?.route?.fromRegion ?? '❌ yo‘q'}
• To country: ${openaiResponse?.route?.toCountry ?? '❌ yo‘q'}
• To region: ${openaiResponse?.route?.toRegion ?? '❌ yo‘q'}
• title: ${openaiResponse?.metaData?.title ?? '❌ yo‘q'}
• weight: ${
          openaiResponse?.metaData?.weight != null &&
          !isNaN(Number(openaiResponse.metaData.weight))
            ? `${Number(openaiResponse.metaData.weight)}`
            : '❌ yo‘q'
        }
• cargoUnit: ${openaiResponse?.metaData?.cargoUnit ?? '❌ yo‘q'}
• vehicleType: ${openaiResponse?.metaData?.vehicleType ?? '❌ yo‘q'}
• paymentType: ${openaiResponse?.metaData?.paymentType ?? '❌ yo‘q'}
• paymentAmount: ${
          openaiResponse?.metaData?.paymentAmount != null &&
          !isNaN(Number(openaiResponse.metaData.paymentAmount))
            ? Number(openaiResponse.metaData.paymentAmount)
            : '❌ yo‘q'
        }
• advancePayment: ${
          openaiResponse?.metaData?.advancePayment != null &&
          !isNaN(Number(openaiResponse.metaData.advancePayment))
            ? Number(openaiResponse.metaData.advancePayment)
            : '❌ yo‘q'
        }
• paymentCurrency: ${openaiResponse?.metaData?.paymentCurrency ?? '❌ yo‘q'}
• pickupDate: ${
          openaiResponse?.metaData?.pickupDate
            ? openaiResponse.metaData.pickupDate
            : '❌ yo‘q'
        }
• phone_number: ${openaiResponse?.metaData?.phone_number ?? '❌ yo‘q'}

\`\`\`
`;

        await this.telegramService.sendToGroup(incompleteMessageText, 26, {
          parseMode: 'Markdown',
        });
      }
      this.logger.debug(
        `Method: ${methodName} - Saved DB Record: ${savedMessage.id}`
      );
    } catch (error) {
      this.logger.error(
        `Method: ${methodName} - Error creating logistic message: ${error.message}`
      );
      throw error;
    }
  }

  async getAllMessages(params?: GetLogisticsMessagesDto) {
    // =====================
    // PAGINATION DEFAULTS
    // =====================
    const page = +params?.page && +params.page > 0 ? +params.page : 1;
    const limit =
      +params?.limit && +params.limit > 0 && +params.limit <= 100
        ? +params.limit
        : 20;

    const skip = (page - 1) * limit;

    // =====================
    // WHERE BUILDER
    // =====================
    const where: Prisma.LogisticMessageWhereInput = {};

    // BASIC FILTERS
    if (params?.channelName) {
      where.channelName = params.channelName;
    }

    if (params?.aiStatus) {
      where.aiStatus = params.aiStatus;
    }

    if (params?.isActual !== undefined) {
      where.isActual = params.isActual;
    }

    // ROUTE FILTERS
    if (params?.countryFrom) {
      where.countryFrom = params.countryFrom;
    }

    if (params?.countryTo) {
      where.countryTo = params.countryTo;
    }

    if (params?.regionFrom) {
      where.regionFrom = params.regionFrom;
    }

    if (params?.regionTo) {
      where.regionTo = params.regionTo;
    }

    // WEIGHT RANGE
    if (params?.weightMin !== undefined || params?.weightMax !== undefined) {
      where.weight = {
        ...(params?.weightMin !== undefined ? { gte: params.weightMin } : {}),
        ...(params?.weightMax !== undefined ? { lte: params.weightMax } : {}),
      };
    }

    // =====================
    // DB QUERIES (parallel)
    // =====================
    const [data, total] = await this.prisma.$transaction([
      this.prisma.logisticMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.logisticMessage.count({ where }),
    ]);

    // =====================
    // RESPONSE
    // =====================
    return {
      page,
      limit,
      total, // jami mos keladigan yozuvlar
      totalPages: Math.ceil(total / limit),
      count: data.length, // shu sahifadagi yozuvlar
      data,
    };
  }

  async getMessageById(id: number) {
    const message = await this.prisma.logisticMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return message;
  }

  async updateMessage(id: number, dto: UpdateLogisticMessageDto) {
    const existing = await this.prisma.logisticMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    // Agar date string bo‘lsa → DateTime ga aylantiramiz
    const payload: any = { ...dto };
    if (dto.date) {
      payload.date = new Date(dto.date);
    }

    const updated = await this.prisma.logisticMessage.update({
      where: { id },
      data: payload,
    });

    return {
      success: true,
      message: 'Message updated successfully',
      data: updated,
    };
  }

  async deleteMessage(id: number) {
    const existing = await this.prisma.logisticMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    await this.prisma.logisticMessage.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Message deleted successfully',
    };
  }

  async restore(
    id: string,
    req: RequestWithUser,
    isService: boolean = false
  ): Promise<any> {
    const methodName: string = this.restore.name;
    this.logger.debug(`Method: ${methodName} - Request:`, id);

    let filter: any = { _id: id, deleted_at: { $ne: null } };

    // if (!application) {
    //   this.logger.debug(
    //     `Method: ${methodName} - Application Not Found or Not Deleted`
    //   );
    //   throw new NotFoundException('Application not found or is not deleted');
    // }

    this.logger.debug(
      `Method: ${methodName} - Application Restored:`,
      application
    );

    return application;
  }

  async normalizePickupDate(rawDate?: string): Promise<Date> {
    if (!rawDate) return null;

    rawDate = rawDate.trim();

    /**
     * 1) DD.MM.YYYY
     */
    const fullMatch = rawDate.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

    if (fullMatch) {
      const day = Number(fullMatch[1]);
      const month = Number(fullMatch[2]) - 1;
      const year = Number(fullMatch[3]);

      const date = new Date(year, month, day);

      return isNaN(date.getTime()) ? null : date;
    }

    /**
     * 2) DD.MM (yilsiz)
     */
    const shortMatch = rawDate.match(/^(\d{1,2})\.(\d{1,2})$/);

    if (shortMatch) {
      const day = Number(shortMatch[1]);
      const month = Number(shortMatch[2]) - 1;

      const now = new Date();
      let year = now.getFullYear();

      let date = new Date(year, month, day);

      // Agar sana o'tib ketgan bo‘lsa → keyingi yil
      if (date < now) {
        year += 1;
        date = new Date(year, month, day);
      }

      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  }

  async formatNumber(num: number): Promise<string> {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
    return num.toFixed(2);
  }
  // @Cron(CronExpression.EVERY_MINUTE)
  async processScrapedChannels(): Promise<any> {
    const methodName = this.processScrapedChannels.name;
    this.logger.debug(`Method: ${methodName} - Scrapingni boshlayapmiz`);

    try {
      // 1️⃣ Scraping
      const response = await axios.get(
        'https://logistics-scraping.coachingzona.uz/mtproto/channels?limit=1'
      );

      const channels = response.data;

      if (!channels) {
        return { success: false, message: 'Maʼlumot topilmadi' };
      }

      let totalSaved = 0;
      let totalSkipped = 0;

      // 2️⃣ Har bir kanal bo‘yicha
      for (const channelName of Object.keys(channels)) {
        const channel = channels[channelName];

        if (!channel.messages || channel.messages.length === 0) continue;

        for (const message of channel.messages) {
          try {
            await this.create({
              tgMessageId: message.id,
              channelName,
              text: message.text,
              date: message.date,
              views: message.views,
            });

            totalSaved++;
          } catch (err) {
            // Duplicate bo‘lsa yoki skip bo‘lsa → create error beradi
            totalSkipped++;
            this.logger.warn(`Message skipped: ${message.id} (${err.message})`);
          }
        }
      }

      return {
        success: true,
        saved: totalSaved,
        skipped: totalSkipped,
      };
    } catch (error) {
      this.logger.error(`Method: ${methodName} - Xatolik: ${error.message}`);

      return {
        success: false,
        message: 'Scraping yoki GPT jarayonida xatolik',
      };
    }
  }
}
