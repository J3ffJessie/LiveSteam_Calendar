import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { TalkEvent } from '../../types/event';
import { calendarLocalizer } from '../../utils/calendar';
import { transformToCalendarEvents } from '../../utils/eventTransform';

interface CalendarViewProps {
  events: TalkEvent[];
  onSelectEvent: (event: TalkEvent) => void;
}

export function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
  const calendarEvents = transformToCalendarEvents(events);

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow-lg">
      <Calendar
        localizer={calendarLocalizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => onSelectEvent(event.resource)}
        className="rounded-lg"
      />
    </div>
  );
}