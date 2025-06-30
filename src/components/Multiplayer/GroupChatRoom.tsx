import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageCircle, Paperclip, Image, Smile, Video, Users, X, Clock, BookOpen } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { StudyGroup } from '../../types';

interface GroupChatRoomProps {
  group: StudyGroup;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

const GroupChatRoom: React.FC<GroupChatRoomProps> = ({ group, onClose }) => {
  const { state } = useGame();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<{userId: string, userName: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate initial messages
  useEffect(() => {
    // Welcome message
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: group.members[0].id,
        userName: group.members[0].name,
        message: `Welcome to the ${group.name} chat! Feel free to ask questions or share resources.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }, 1000);

    // Simulate some initial conversation
    if (group.currentModule) {
      setTimeout(() => {
        const discussionMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: group.members[1]?.id || group.members[0].id,
          userName: group.members[1]?.name || group.members[0].name,
          message: `Let's discuss today's topic: ${group.currentModule}. What aspects are you finding most challenging?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, discussionMessage]);
      }, 2000);
    }
  }, [group]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: state.user.id,
      userName: state.user.name,
      message: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate response from another group member
    if (Math.random() > 0.3) {
      // Show typing indicator
      const randomMember = group.members.find(m => m.id !== state.user.id);
      if (randomMember) {
        setIsTyping({
          userId: randomMember.id,
          userName: randomMember.name
        });

        // Then show response
        setTimeout(() => {
          setIsTyping(null);
          
          const responses = [
            "That's a great point! I agree with your perspective.",
            "Interesting thought. Have you considered looking at the latest research on this topic?",
            "I had a similar case in my clinical rotation. The approach we took was different though.",
            "Thanks for sharing! This helps me understand the concept better.",
            "I'm not sure I follow. Could you elaborate a bit more?",
            "That's exactly what we covered in last week's lecture!",
            "Have you tried using that technique in practice? How did it work out?",
            "I found a great article about this topic. I'll share it with the group later."
          ];
          
          const responseMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: randomMember.id,
            userName: randomMember.name,
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }, Math.random() * 3000 + 1000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{group.name}</h2>
              <p className="text-sm text-blue-100">{group.members.length} members • {group.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                // Start video session
              }}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Video className="w-5 h-5" />
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
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-4">Start the conversation with your study group</p>
            <div className="flex justify-center space-x-2">
              <button 
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                onClick={() => setMessage("Hi everyone! What topic should we focus on today?")}
              >
                Say hello
              </button>
              <button 
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                onClick={() => setMessage("I'm having trouble with a concept. Can someone help explain it?")}
              >
                Ask for help
              </button>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.userId === state.user.id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.userId !== state.user.id && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {msg.userName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="max-w-[75%]">
                {msg.userId !== state.user.id && (
                  <p className="text-xs text-gray-500 mb-1">{msg.userName}</p>
                )}
                <div className={`p-3 rounded-lg ${
                  msg.userId === state.user.id 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.userId === state.user.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              {msg.userId === state.user.id && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">
                  {state.user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {isTyping.userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{isTyping.userName}</p>
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

      {/* Group Info */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{group.members.length} members</span>
          </div>
          {group.currentModule && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>Studying: {group.currentModule}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Created {formatDate(group.createdAt)}</span>
          </div>
        </div>
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
    </div>
  );
};

// Helper function to format date
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default GroupChatRoom;