import { format } from 'date-fns';

export interface AnalyticsEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  trackEvent(type: string, data: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: Date.now(),
    };

    this.events.push(event);
    
    // Prevent memory leaks by limiting stored events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // In production, you'd send this to your analytics service
    if (import.meta.env.PROD) {
      this.sendToAnalyticsService(event);
    }
  }

  getEventsByType(type: string): AnalyticsEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsByDateRange(startDate: Date, endDate: Date): AnalyticsEvent[] {
    return this.events.filter(event => 
      event.timestamp >= startDate.getTime() && 
      event.timestamp <= endDate.getTime()
    );
  }

  generateReport(startDate: Date, endDate: Date) {
    const events = this.getEventsByDateRange(startDate, endDate);
    
    const report = {
      period: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
      },
      totalEvents: events.length,
      eventsByType: {} as Record<string, number>,
      timeline: this.generateTimeline(events),
    };

    events.forEach(event => {
      report.eventsByType[event.type] = (report.eventsByType[event.type] || 0) + 1;
    });

    return report;
  }

  private generateTimeline(events: AnalyticsEvent[]) {
    const timeline: Record<string, number> = {};
    
    events.forEach(event => {
      const date = format(event.timestamp, 'yyyy-MM-dd');
      timeline[date] = (timeline[date] || 0) + 1;
    });

    return timeline;
  }

  private async sendToAnalyticsService(event: AnalyticsEvent) {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to send analytics event');
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}

export const analytics = new Analytics();