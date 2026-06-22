import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  // Bump this string when you want to visually confirm a fresh deploy hit the server.
  private static readonly DEPLOY_MARKER = 'deploy-test-1';

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Liveness probe. Returns server time, uptime and a manual deploy marker — bump DEPLOY_MARKER in source to verify a new deploy landed.',
  })
  ping() {
    return {
      status: 'ok',
      marker: HealthController.DEPLOY_MARKER,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      node: process.version,
      env: process.env.NODE_ENV || 'development',
    };
  }
}
