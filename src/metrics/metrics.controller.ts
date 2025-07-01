import { Controller, Get, Request, Response } from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async metrics(@Request() req: ExpressRequest, @Response() res: ExpressResponse): Promise<void> {
    await this.metricsService.metrics(req, res);
  }
}
