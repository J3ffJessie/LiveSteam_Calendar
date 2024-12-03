import { Clock, Users, User, Video } from 'lucide-react';
import { TalkEvent } from '../../types/event';
import { format } from 'date-fns';

interface EventCardProps {
  event: TalkEvent;
  onSubscribe: (eventId: string) => void;
  onJoinStream?: (eventId: string) => void;
  showJoinStream?: boolean;
  currentUserId: string;
}

export function EventCard({ event, onSubscribe, onJoinStream, showJoinStream, currentUserId }: EventCardProps) {
  const isLive = new Date() >= event.startTime && new Date() <= event.endTime;
  const isHost = event.host.id === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        {isLive && (
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            LIVE
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{event.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>{format(event.startTime, 'PPp')}</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <User className="w-4 h-4 mr-2" />
          <span>
            {event.host.name}
            {isHost && ' (You)'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {showJoinStream && isLive && onJoinStream && (
          <button
            onClick={() => onJoinStream(event.id)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <Video className="w-4 h-4 mr-2" />
            {isHost ? 'Start Stream' : 'Join Stream'}
          </button>
        )}
        
        {!isHost && (
          <button
            onClick={() => onSubscribe(event.id)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            disabled={event.currentAttendees >= event.maxAttendees}
          >
            {event.currentAttendees >= event.maxAttendees ? 'Event Full' : 'Subscribe to Event'}
          </button>
        )}
      </div>
    </div>
  );
}