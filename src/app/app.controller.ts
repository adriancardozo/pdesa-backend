import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { VersionResponse } from './response/version.response';
import { MetricsInterceptor } from 'src/metrics/interceptor/metrics.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Version' })
  @ApiOkResponse({ type: VersionResponse })
  @UseInterceptors(MetricsInterceptor)
  @Get('version')
  version(): VersionResponse {
    return new VersionResponse(this.appService.version());
  }
}
