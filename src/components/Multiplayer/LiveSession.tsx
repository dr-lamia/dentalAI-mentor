import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Video, X, Send, Mic, MicOff, Camera, CameraOff, Share, Crown } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface LiveSessionProps {
  roomId: string;
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isSpeaking: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  isScreenSharing: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

const LiveSession: React.FC<LiveSessionProps> = ({ roomId, onClose }) => {
  const { state } = useGame();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Initialize participants
  useEffect(() => {
    // Add current user as host
    const initialParticipants: Participant[] = [
      {
        id: state.user.id,
        name: state.user.name,
        isHost: true,
        isSpeaking: false,
        hasVideo: true,
        hasAudio: true,
        isScreenSharing: false
      }
    ];
    
    // Add other participants from multiplayer state
    state.multiplayer.participants.forEach(participant => {
      if (participant.id !== state.user.id) {
        initialParticipants.push({
          id: participant.id,
          name: participant.name,
          isHost: false,
          isSpeaking: false,
          hasVideo: Math.random() > 0.3,
          hasAudio: Math.random() > 0.2,
          isScreenSharing: false
        });
      }
    });
    
    setParticipants(initialParticipants);
    
    // Simulate speaking indicators
    const speakingInterval = setInterval(() => {
      setParticipants(prev => 
        prev.map(p => ({
          ...p,
          isSpeaking: p.hasAudio && Math.random() > 0.7
        }))
      );
    }, 2000);
    
    return () => clearInterval(speakingInterval);
  }, [state.user.id, state.multiplayer.participants]);

  const sendChatMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: state.user.id,
      userName: state.user.name,
      message: message.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate responses
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const randomParticipant = participants.find(p => p.id !== state.user.id);
        if (randomParticipant) {
          const responses = [
            "Good point!",
            "I agree with that.",
            "Could you explain that in more detail?",
            "That's interesting, I hadn't thought of it that way.",
            "Let me share my screen to show you what I mean.",
            "Does anyone have any questions about this topic?",
            "I found a great resource on this, I'll share the link."
          ];
          
          const responseMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: randomParticipant.id,
            userName: randomParticipant.name,
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, responseMessage]);
        }
      }, Math.random() * 3000 + 1000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white rounded-xl overflow-hidden">
      {/* Session Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Live Study Session</h2>
              <p className="text-blue-200 text-sm">Room ID: {roomId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${
                showChat ? 'bg-purple-500' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className={`${showChat ? 'w-2/3' : 'w-full'} p-4 grid grid-cols-2 gap-4 auto-rows-fr`}>
          {participants.map((participant) => (
            <div 
              key={participant.id}
              className={`relative rounded-xl overflow-hidden border-2 ${
                participant.isSpeaking ? 'border-green-500' : 'border-transparent'
              }`}
            >
              {participant.hasVideo ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* This would be a video element in a real implementation */}
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{participant.name}</p>
                  </div>
                </div>
              )}
              
              {/* Status indicators */}
              <div className="absolute bottom-3 left-3 flex space-x-2">
                {!participant.hasAudio && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <MicOff className="w-3 h-3" />
                  </div>
                )}
                {!participant.hasVideo && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <CameraOff className="w-3 h-3" />
                  </div>
                )}
                {participant.isScreenSharing && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Share className="w-3 h-3" />
                  </div>
                )}
                {participant.isHost && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-1/3 border-l border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700 bg-gray-800">
              <h3 className="font-semibold">Session Chat</h3>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No messages yet</p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.userId === state.user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.userId !== state.user.id && (
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold mr-1 flex-shrink-0">
                        {msg.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className={`max-w-[80%] p-2 rounded-lg ${
                      msg.userId === state.user.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {msg.userId !== state.user.id && (
                        <p className="text-xs text-gray-300 mb-1">{msg.userName}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border-none rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setHasAudio(!hasAudio)}
            className={`p-3 rounded-full ${
              hasAudio ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            {hasAudio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setHasVideo(!hasVideo)}
            className={`p-3 rounded-full ${
              hasVideo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            {hasVideo ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full ${
              isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            <Share className="w-5 h-5" />
          </button>
          
          <button
            onClick={onClose}
            className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;