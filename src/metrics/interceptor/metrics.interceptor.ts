import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, finalize } from 'rxjs';
import { MetricsService } from '../metrics.service';
import { Request } from 'express';
import { MetricsDefaultOptions } from '../type/metrics-default-options.type';

@Injectable()
export class MetricsInterceptor<T = any> implements NestInterceptor<T, T> {
  private readonly defaults: MetricsDefaultOptions = {
    counter: true,
    gauge: true,
    histogram: true,
    fails: true,
  };
  private options: MetricsDefaultOptions;

  constructor(private readonly metricsService: MetricsService) {
    this.options = { ...this.defaults };
  }

  updateOptions(options?: MetricsDefaultOptions) {
    this.options = { ...this.options, ...options };
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const { path, method }: Request = context.switchToHttp().getRequest();
    const labels = { method, path };
    const endArgs = this.metricsService.startCollect(labels, this.options);
    return next
      .handle()
      .pipe<T>(catchError((error) => this.metricsService.failCollect(error, labels, this.options)))
      .pipe<T>(finalize(() => this.metricsService.endCollect(labels, endArgs)));
  }
}
