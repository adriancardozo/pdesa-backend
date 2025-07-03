import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from 'src/config/configuration';
import { mock } from 'test/resources/mocks/mock';
import { MetricsService } from 'src/metrics/metrics.service';
import promClient from 'prom-client';
import { Request, Response } from 'express';
import { mockPropertyValue } from 'test/resources/mocks/mock-property-value';
import { contentType, labels, metrics } from './test-data/metrics.service.spec.data';

jest.mock('prom-client');

describe('MetricsService', () => {
  let module: TestingModule;
  let service: MetricsService;
  const { Counter, Histogram, Gauge, Registry } = promClient as jest.Mocked<typeof promClient>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [MetricsService],
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
    })
      .useMocker(mock)
      .compile();

    service = module.get<MetricsService>(MetricsService);
  });

  describe('Start collect', () => {
    let endFunctionsResult: { endGauge: jest.Mock; endHistogramObserve: jest.Mock };

    beforeEach(() => {
      Counter.prototype.inc = jest.fn();
      endFunctionsResult = { endGauge: jest.fn(), endHistogramObserve: jest.fn() };
      Gauge.prototype.startTimer.mockReturnValue(endFunctionsResult.endGauge);
      Histogram.prototype.startTimer.mockReturnValue(endFunctionsResult.endHistogramObserve);
    });

    it('should increment request counter', () => {
      service.startCollect(labels, { counter: true });
      expect(Counter.prototype.inc).toHaveBeenCalledWith(labels);
    });

    it('should start gauge timer', () => {
      service.startCollect(labels, { gauge: true });
      expect(Gauge.prototype.startTimer).toHaveBeenCalledWith(labels);
    });

    it('should start histogram timer', () => {
      service.startCollect(labels, { histogram: true });
      expect(Histogram.prototype.startTimer).toHaveBeenCalledWith(labels);
    });

    it('should return gauge and histogram end timer functions', () => {
      const result = service.startCollect(labels, { gauge: true, histogram: true });
      expect(result).toMatchObject(endFunctionsResult);
    });
  });

  describe('End collect', () => {
    let endFunctionsResult: { endGauge: jest.Mock; endHistogramObserve: jest.Mock };

    beforeEach(() => {
      endFunctionsResult = { endGauge: jest.fn(), endHistogramObserve: jest.fn() };
    });

    it('should call end gauge timer function', () => {
      service.endCollect(labels, { ...endFunctionsResult, endHistogramObserve: null });
      expect(endFunctionsResult.endGauge).toHaveBeenCalledWith(labels);
    });

    it('should call end histogram timer function', () => {
      service.endCollect(labels, { ...endFunctionsResult, endGauge: null });
      expect(endFunctionsResult.endHistogramObserve).toHaveBeenCalledWith(labels);
    });
  });

  describe('Fail collect', () => {
    it('should increment fail counter', () => {
      service.failCollect({}, labels, { fails: true });
      expect(Counter.prototype.inc).toHaveBeenCalledWith(labels);
    });
  });

  describe('Metrics', () => {
    let request: jest.Mocked<Request>;
    let response: jest.Mocked<Response>;

    beforeEach(() => {
      request = {} as jest.Mocked<Request>;
      response = { set: jest.fn(), end: jest.fn() } as any as jest.Mocked<Response>;
      mockPropertyValue(Registry.prototype, 'contentType', contentType);
      Registry.prototype.metrics.mockResolvedValue(metrics);
    });

    it('should set content type', async () => {
      await service.metrics(request, response);
      expect(response.set).toHaveBeenCalledWith('Content-Type', contentType);
    });

    it('should end request with metrics', async () => {
      await service.metrics(request, response);
      expect(response.end).toHaveBeenCalledWith(metrics);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
    jest.resetAllMocks();
  });
});
