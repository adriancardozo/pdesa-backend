export type EndCollectArgs = {
  endHistogramObserve: ((labels?: Partial<Record<string, string | number>>) => number) | null;
  endGauge: ((labels?: Partial<Record<string, string | number>>) => number) | null;
};
