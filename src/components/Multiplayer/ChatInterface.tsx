import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageCircle, Paperclip, Image, Smile, Video, Users, X } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ChatInterfaceProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ groupId, groupName, onClose }) => {
  const { state } = useGame();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [participants, setParticipants] = useState<{id: string, name: string, isOnline: boolean}[]>([
    { id: '1', name: 'Sarah Chen', isOnline: true },
    { id: '2', name: 'Michael Rodriguez', isOnline: true },
    { id: '3', name: 'Emily Zhang', isOnline: false },
    { id: state.user.id, name: state.user.name, isOnline: true }
  ]);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate receiving messages
  useEffect(() => {
    const simulateMessages = () => {
      // Initial welcome message
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: '1',
          senderName: 'Sarah Chen',
          content: `Welcome to the ${groupName} chat! Feel free to ask questions or share resources.`,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, welcomeMessage]);
      }, 1000);

      // Simulate periodic messages
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const randomParticipant = participants.find(p => p.id !== state.user.id && p.isOnline);
          if (randomParticipant) {
            const randomMessages = [
              "Has anyone reviewed the latest article on pulp regeneration techniques?",
              "I'm struggling with the concept of guided tissue regeneration. Any resources to recommend?",
              "Just finished a complex case today. Would love to discuss the approach I took.",
              "Is anyone attending the virtual conference next week?",
              "I found this great video on crown preparation. Let me share the link later.",
              "What's everyone's opinion on the new digital impression system?",
              "Has anyone used the new bioactive materials in their practice?",
              "I'm preparing for my board exams. Any tips?"
            ];
            
            const newMessage: ChatMessage = {
              id: Date.now().toString(),
              senderId: randomParticipant.id,
              senderName: randomParticipant.name,
              content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
              timestamp: new Date(),
              type: 'text'
            };
            
            setMessages(prev => [...prev, newMessage]);
          }
        }
      }, 45000);

      return () => clearInterval(interval);
    };

    simulateMessages();
  }, [groupName, participants, state.user.id]);

  // Simulate typing indicators
  useEffect(() => {
    if (message.length > 0) {
      // Simulate sending typing indicator to other users
    }
  }, [message]);

  // Simulate receiving typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && !isTyping) {
        const randomParticipant = participants.find(p => p.id !== state.user.id && p.isOnline);
        if (randomParticipant) {
          setIsTyping(true);
          setTypingUser(randomParticipant.name);
          
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser('');
          }, Math.random() * 5000 + 1000);
        }
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isTyping, participants, state.user.id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: state.user.id,
      senderName: state.user.name,
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate response
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const randomParticipant = participants.find(p => p.id !== state.user.id && p.isOnline);
        if (randomParticipant) {
          // Show typing indicator
          setIsTyping(true);
          setTypingUser(randomParticipant.name);
          
          // Then show message
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser('');
            
            const responses = [
              "That's a great point!",
              "I agree with your perspective.",
              "Interesting thought. Have you considered looking at the latest research on this?",
              "I had a similar case in my clinical rotation.",
              "Thanks for sharing! This helps me understand better.",
              "I'm not sure I follow. Could you elaborate?",
              "That's exactly what we covered in last week's lecture!",
              "Have you tried using that technique in practice?"
            ];
            
            const responseMessage: ChatMessage = {
              id: Date.now().toString(),
              senderId: randomParticipant.id,
              senderName: randomParticipant.name,
              content: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date(),
              type: 'text'
            };
            
            setMessages(prev => [...prev, responseMessage]);
          }, Math.random() * 3000 + 1000);
        }
      }, Math.random() * 2000 + 500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{groupName}</h2>
              <p className="text-sm text-blue-100">{participants.length} participants</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === state.user.id ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderId !== state.user.id && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                {msg.senderName.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div className="max-w-[75%]">
              {msg.senderId !== state.user.id && (
                <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
              )}
              <div className={`p-3 rounded-lg ${
                msg.senderId === state.user.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.type === 'text' ? (
                  <p>{msg.content}</p>
                ) : msg.type === 'image' ? (
                  <div>
                    <img src={msg.fileUrl} alt="Shared image" className="rounded-lg max-w-full" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4" />
                    <span>{msg.fileName}</span>
                  </div>
                )}
                <p className={`text-xs mt-1 ${
                  msg.senderId === state.user.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
            {msg.senderId === state.user.id && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">
                {state.user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {typingUser.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{typingUser}</p>
              <div className="bg-gray-100 p-3 rounded-lg inline-block">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Image className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && message.trim()) {
                handleSendMessage();
              }
            }}
          />
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Participants Sidebar */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 bottom-0 w-64 bg-white border-l border-gray-200 shadow-lg z-10"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Participants</h3>
                <button 
                  onClick={() => setShowParticipants(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-[calc(100%-60px)] overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.isOnline ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                  {participant.id !== state.user.id && (
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-500">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-500">
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;