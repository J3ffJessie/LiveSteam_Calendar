import React from 'react';
import { X } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { format } from 'date-fns';

interface FeaturedMessageProps {
  message: ChatMessage;
  onRemove: () => void;
  isHost: boolean;
}

export function FeaturedMessage({ message, onRemove, isHost }: FeaturedMessageProps) {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white p-4 rounded-lg shadow-lg max-w-2xl w-full mx-4 animate-fade-in">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.senderName}</span>
          <span className="text-xs text-gray-400">{format(message.timestamp, 'HH:mm')}</span>
        </div>
        {isHost && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-lg">{message.content}</p>
    </div>
  );
}