import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { VersionResponse } from './response/version.response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Version' })
  @ApiOkResponse({ type: VersionResponse })
  @Get('version')
  version(): VersionResponse {
    return new VersionResponse(this.appService.version());
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
