import React from 'react';
import { StreamParticipant } from '../../types/stream';

interface ParticipantGridProps {
  participants: StreamParticipant[];
  localVideoRef: React.RefObject<HTMLVideoElement>;
  localParticipant: {
    isHost: boolean;
  };
}

export function ParticipantGrid({ participants, localVideoRef, localParticipant }: ParticipantGridProps) {
  const totalParticipants = participants.length + 1; // +1 for local participant
  
  const gridConfig = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2',
    6: 'grid-cols-2 lg:grid-cols-3',
    8: 'grid-cols-2 lg:grid-cols-4',
    default: 'grid-cols-3 lg:grid-cols-4'
  };

  const gridClass = gridConfig[totalParticipants as keyof typeof gridConfig] || gridConfig.default;

  return (
    <div className={`grid ${gridClass} gap-4 h-full`}>
      {/* Local participant */}
      <div className="relative aspect-video">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover rounded-lg bg-gray-800"
        />
        <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          You {localParticipant.isHost ? '(Host)' : ''}
        </div>
      </div>

      {/* Remote participants */}
      {participants.map(participant => (
        <div key={participant.id} className="relative aspect-video">
          {participant.stream ? (
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg bg-gray-800"
              srcObject={participant.stream}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Loading...</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            {participant.name} {participant.isHost ? '(Host)' : ''}
          </div>
        </div>
      ))}
    </div>
  );
}