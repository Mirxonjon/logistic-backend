import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto, CreateUserDto, UpdateUserDto, UserLoginDto, CreateAdminDto } from '@/types/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: AdminLoginDto })
  @ApiOkResponse({ description: 'JWT token', schema: { properties: { accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/create-user')
  @ApiOperation({ summary: 'Create dispatcher (ADMIN)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Patch('admin/update-user/:id')
  @ApiOperation({ summary: 'Update user (ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, dto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  // @ApiBearerAuth()
  @Post('admin/create-admin')
  @ApiOperation({ summary: 'Create admin (ADMIN only)' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }

  @Post('user/login')
  @ApiOperation({ summary: 'Dispatcher login with 10-digit code' })
  @ApiBody({ type: UserLoginDto })
  @ApiOkResponse({ description: 'JWT token', schema: { properties: { accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } } })
  async userLogin(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto);
  }
}
