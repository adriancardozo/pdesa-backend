import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Registry,
  Counter,
  collectDefaultMetrics,
  Gauge,
  Histogram,
  PrometheusContentType,
} from 'prom-client';
import { Configuration } from 'src/config/configuration';
import { Observable, throwError } from 'rxjs';
import { EndCollectArgs } from './type/end-collect-args.type';
import { CollectLabels } from './type/collect-labels.type';
import { MetricsDefaultOptions } from './type/metrics-default-options.type';
import { Request, Response } from 'express';

@Injectable()
export class MetricsService {
  private readonly register: Registry;
  private readonly requestCounter: Counter<string>;
  private readonly failsCounter: Counter<string>;
  private readonly requestGauge: Gauge;
  public histogram: Histogram;

  get contentType(): PrometheusContentType {
    return this.register.contentType;
  }

  constructor(private readonly configService: ConfigService) {
    const { app, options }: Configuration['metrics'] = this.configService.get('metrics')!;
    this.register = new Registry<PrometheusContentType>();
    this.register.setDefaultLabels({ app });
    collectDefaultMetrics({ register: this.register });
    const registers = [this.register];
    this.failsCounter = new Counter({ ...options.failsCounter, registers });
    this.requestCounter = new Counter({ ...options.counter, registers });
    this.requestGauge = new Gauge({ ...options.gauge, registers });
    this.histogram = new Histogram({ ...options.histogram, registers });
  }

  startCollect(labels: CollectLabels, options: MetricsDefaultOptions): EndCollectArgs {
    const { counter, gauge, histogram } = options;
    if (counter) this.requestCounter.inc(labels);
    const endHistogramObserve = histogram ? this.histogram.startTimer(labels) : null;
    const endGauge = gauge ? this.requestGauge.startTimer(labels) : null;
    return { endHistogramObserve, endGauge };
  }

  failCollect(error: any, labels: CollectLabels, options: MetricsDefaultOptions): Observable<any> {
    if (options.fails) this.failsCounter.inc(labels);
    return throwError(() => error);
  }

  endCollect(labels: CollectLabels, endArgs: EndCollectArgs): void {
    const { endGauge, endHistogramObserve } = endArgs;
    if (endGauge) endGauge(labels);
    if (endHistogramObserve) endHistogramObserve(labels);
  }

  async metrics(req: Request, res: Response): Promise<void> {
    res.set('Content-Type', this.contentType);
    res.end(await this.register.metrics());
  }
}
