export interface TalkEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  host: {
    id: string;
    name: string;
  };
  maxAttendees: number;
  currentAttendees: number;
}