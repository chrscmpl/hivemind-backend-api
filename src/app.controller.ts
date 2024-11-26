import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  // @ts-expect-error temporarily disable ts(6133) from flag noUnusedLocals
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Perform a service health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @Get(['/', '/health', '/ping'])
  public HealthCheck() {}
}
