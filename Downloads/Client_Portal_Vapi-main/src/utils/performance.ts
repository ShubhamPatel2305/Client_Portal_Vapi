export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private readonly MAX_SAMPLES = 100;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(id: string) {
    if (!performance) return;
    performance.mark(`${id}-start`);
  }

  endMeasure(id: string) {
    if (!performance) return;
    
    performance.mark(`${id}-end`);
    performance.measure(id, `${id}-start`, `${id}-end`);
    
    const entries = performance.getEntriesByName(id);
    const duration = entries[entries.length - 1].duration;
    
    this.recordMetric(id, duration);
    
    // Cleanup
    performance.clearMarks(`${id}-start`);
    performance.clearMarks(`${id}-end`);
    performance.clearMeasures(id);
  }

  private recordMetric(id: string, value: number) {
    const metrics = this.metrics.get(id) || [];
    metrics.push(value);
    
    // Keep only the last MAX_SAMPLES values
    if (metrics.length > this.MAX_SAMPLES) {
      metrics.shift();
    }
    
    this.metrics.set(id, metrics);
  }

  getMetrics(id: string) {
    const metrics = this.metrics.get(id) || [];
    
    return {
      average: this.calculateAverage(metrics),
      median: this.calculateMedian(metrics),
      p95: this.calculatePercentile(metrics, 95),
      min: Math.min(...metrics),
      max: Math.max(...metrics),
      samples: metrics.length,
    };
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    
    return sorted[index];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();