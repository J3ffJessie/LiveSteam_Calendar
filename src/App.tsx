import React, { useState } from 'react';
import { CalendarView } from './components/Calendar/CalendarView';
import { EventCard } from './components/Events/EventCard';
import { EventForm } from './components/Events/EventForm';
import { StreamView } from './components/Stream/StreamView';
import { TalkEvent } from './types/event';
import { StreamSession } from './types/stream';
import { Calendar, Plus, List } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const [currentUserId] = useState(() => crypto.randomUUID());
  const [events, setEvents] = useState<TalkEvent[]>([]);
  const [view, setView] = useState<'calendar' | 'list' | 'create' | 'stream'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<TalkEvent | null>(null);
  const [activeStream, setActiveStream] = useState<StreamSession | null>(null);

  const handleCreateEvent = (eventData: Omit<TalkEvent, 'id' | 'currentAttendees' | 'host'>) => {
    const newEvent: TalkEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      currentAttendees: 0,
      host: {
        id: currentUserId,
        name: eventData.host.name
      }
    };
    setEvents([...events, newEvent]);
    setView('calendar');
  };

  const handleSubscribe = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, currentAttendees: event.currentAttendees + 1 }
        : event
    ));
    alert('Subscribed! You would receive an email confirmation in a real application.');
  };

  const handleJoinStream = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const isHost = event.host.id === currentUserId;
      setActiveStream({
        eventId,
        participants: [
          { id: currentUserId, name: isHost ? event.host.name : 'Attendee', isHost }
        ],
        isActive: true
      });
      setView('stream');
    }
  };

  const handleLeaveStream = () => {
    setActiveStream(null);
    setView('list');
  };

  const ViewButton = ({ viewType, icon: Icon, label }: { viewType: typeof view, icon: typeof Calendar, label: string }) => (
    <button
      onClick={() => setView(viewType)}
      className={clsx(
        'flex items-center px-4 py-2 rounded-md transition-colors',
        view === viewType ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      )}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Talk Studio</h1>
            {view !== 'stream' && (
              <div className="flex space-x-4">
                <ViewButton viewType="calendar" icon={Calendar} label="Calendar" />
                <ViewButton viewType="list" icon={List} label="Events" />
                <ViewButton viewType="create" icon={Plus} label="Create Event" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === 'calendar' && (
          <CalendarView 
            events={events}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        )}

        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSubscribe={handleSubscribe}
                onJoinStream={handleJoinStream}
                showJoinStream={true}
                currentUserId={currentUserId}
              />
            ))}
            {events.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No events scheduled yet. Create your first event!
              </p>
            )}
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Create New Event</h2>
            <EventForm onSubmit={handleCreateEvent} />
          </div>
        )}

        {view === 'stream' && activeStream && (
          <div className="h-[calc(100vh-12rem)]">
            <StreamView
              eventId={activeStream.eventId}
              isHost={activeStream.participants.find(p => p.id === currentUserId)?.isHost ?? false}
              participants={activeStream.participants}
              onLeave={handleLeaveStream}
            />
          </div>
        )}

        {selectedEvent && view !== 'stream' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <EventCard
                event={selectedEvent}
                onSubscribe={handleSubscribe}
                onJoinStream={handleJoinStream}
                showJoinStream={true}
                currentUserId={currentUserId}
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;