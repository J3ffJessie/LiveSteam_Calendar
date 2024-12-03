import { TalkEvent } from '../types/event';

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: TalkEvent;
}

export function transformToCalendarEvents(events: TalkEvent[]): CalendarEvent[] {
  return events.map((event) => ({
    title: event.title,
    start: event.startTime,
    end: event.endTime,
    resource: event,
  }));
}