import React, { useState, useRef, useEffect } from 'react';
import { Send, Star } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { format } from 'date-fns';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onFeatureMessage?: (messageId: string) => void;
  isHost: boolean;
}

export function ChatPanel({ messages, onSendMessage, onFeatureMessage, isHost }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Live Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                {msg.senderName}
                {msg.isHost && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Host
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-400">
                {format(msg.timestamp, 'HH:mm')}
              </span>
              {isHost && onFeatureMessage && (
                <button
                  onClick={() => onFeatureMessage(msg.id)}
                  className={`ml-auto p-1 rounded-full transition-colors ${
                    msg.featured
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-gray-300 mt-1">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}