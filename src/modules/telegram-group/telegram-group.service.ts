import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CreateTelegramGroupDto } from '@/types/telegram-group';
import { UpdateTelegramGroupDto } from '@/types/telegram-group';
import { QueryTelegramGroupDto } from '@/types/telegram-group';

@Injectable()
export class TelegramGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTelegramGroupDto) {
    const exists = await this.prisma.telegramGroup.findUnique({
      where: { username: dto.username },
    });
    if (exists) {
      throw new ConflictException(
        'Telegram group with this username already exists'
      );
    }

    return this.prisma.telegramGroup.create({
      data: {
        username: dto.username,
        title: dto.title ?? null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(query: QueryTelegramGroupDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;
    console.log(query);

    const where: any = {};
    if (query.isActive) {
      where.isActive = query.isActive === 'TRUE';
    }

    if (query.username && query.username.trim()) {
      where.username = { contains: query.username.trim(), mode: 'insensitive' };
    }
    if (query.title && query.title.trim()) {
      where.title = {
        contains: query.title.trim(),
        mode: 'insensitive',
      } as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.telegramGroup.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.telegramGroup.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async findById(id: number) {
    const group = await this.prisma.telegramGroup.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException('Telegram group not found');
    }
    return group;
  }

  async update(id: number, dto: UpdateTelegramGroupDto) {
    const group = await this.prisma.telegramGroup.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException('Telegram group not found');
    }

    return this.prisma.telegramGroup.update({
      where: { id },
      data: {
        title: dto.title ?? group.title,
        isActive: dto.isActive ?? group.isActive,
      },
    });
  }

  async deactivate(id: number) {
    const group = await this.prisma.telegramGroup.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException('Telegram group not found');
    }

    if (group.isActive === false) return group;

    return this.prisma.telegramGroup.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
