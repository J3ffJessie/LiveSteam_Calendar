import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, MessageCircle } from 'lucide-react';
import { StreamParticipant } from '../../types/stream';
import { ChatMessage } from '../../types/chat';
import { ChatPanel } from './ChatPanel';
import { ParticipantGrid } from './ParticipantGrid';
import { FeaturedMessage } from './FeaturedMessage';

interface StreamViewProps {
  eventId: string;
  isHost: boolean;
  participants: StreamParticipant[];
  onLeave: () => void;
}

export function StreamView({ eventId, isHost, participants, onLeave }: StreamViewProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [featuredMessage, setFeaturedMessage] = useState<ChatMessage | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function setupLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }
    setupLocalStream();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: 'you',
      senderName: isHost ? 'Host' : 'You',
      content,
      timestamp: new Date(),
      isHost,
    };
    setMessages([...messages, newMessage]);
  };

  const handleFeatureMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const updatedMessages = messages.map(m => ({
        ...m,
        featured: m.id === messageId ? !m.featured : false
      }));
      setMessages(updatedMessages);
      setFeaturedMessage(message.featured ? null : message);
    }
  };

  return (
    <div className="flex h-full bg-gray-900">
      <div className={`flex-1 flex flex-col ${isChatOpen ? 'mr-4' : ''}`}>
        <div className="flex-1 p-4 relative">
          <ParticipantGrid
            participants={participants}
            localVideoRef={localVideoRef}
            localParticipant={{ isHost }}
          />
          {featuredMessage && (
            <FeaturedMessage
              message={featuredMessage}
              onRemove={() => handleFeatureMessage(featuredMessage.id)}
              isHost={isHost}
            />
          )}
        </div>

        <div className="bg-gray-800 p-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full ${
                isMicOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isMicOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full ${
                isCameraOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isCameraOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
            </button>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-3 rounded-full ${
                isChatOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={onLeave}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Leave Stream
            </button>
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="w-80 border-l border-gray-700">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onFeatureMessage={isHost ? handleFeatureMessage : undefined}
            isHost={isHost}
          />
        </div>
      )}
    </div>
  );
}