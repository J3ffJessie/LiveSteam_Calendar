export interface StreamParticipant {
  id: string;
  name: string;
  isHost: boolean;
  stream?: MediaStream;
}

export interface StreamSession {
  eventId: string;
  participants: StreamParticipant[];
  isActive: boolean;
}