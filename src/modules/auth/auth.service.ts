import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  AdminLoginDto,
  CreateUserDto,
  UpdateUserDto,
  UserLoginDto,
  CreateAdminDto,
} from '@/types/auth';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private signToken(user: { id: number; role: 'ADMIN' | 'DISPATCHER' }) {
    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async adminLogin(dto: AdminLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { username: dto.username },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    if (!user.isActive) {
      throw new ForbiddenException('User is inactive');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken({
      id: user.id,
      role: user.role as any,
    });
  }

  async userLogin(dto: UserLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { loginCode: dto.loginCode },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid login code');
    }
    if (user.role !== 'DISPATCHER') {
      throw new ForbiddenException('Access denied');
    }
    if (!user.isActive) {
      throw new ForbiddenException('User is inactive');
    }
    console.log(user);

    return {
      accessToken: this.signToken({ id: user.id, role: user.role as any })
        ?.accessToken,

      user: {
        fullName: user.fullName,
        role: user.role,
        paymentDate: user.paymentDate,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  async createUser(dto: CreateUserDto) {
    const loginCode = await this.generateUniqueLoginCode();
    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + 1);

    const created = await this.prisma.user.create({
      data: {
        fullName: dto.fullName ?? null,
        role: 'DISPATCHER',
        loginCode,
        paymentDate,
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        isActive: true,
        loginCode: true,
        paymentDate: true,
        createdAt: true,
      },
    });
    return created;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: dto.fullName ?? user.fullName,
        isActive:
          typeof dto.isActive === 'boolean' ? dto.isActive : user.isActive,
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        isActive: true,
        loginCode: true,
        updatedAt: true,
      },
    });
    return updated;
  }

  async createAdmin(dto: CreateAdminDto) {
    const exists = await this.prisma.user.findFirst({
      where: { username: dto.username },
    });
    if (exists) {
      throw new BadRequestException('Username already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const created = await this.prisma.user.create({
      data: {
        fullName: dto.fullName ?? null,
        username: dto.username,
        password: hashed,
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return created;
  }

  private async generateUniqueLoginCode(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const code = this.generateLoginCode();
      const exists = await this.prisma.user.findFirst({
        where: { loginCode: code },
      });
      if (!exists) return code;
    }
    throw new BadRequestException('Failed to generate unique login code');
  }

  private generateLoginCode(): string {
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }
}
