import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

interface AIIntegratedChatProps {
  isVisible: boolean;
  onClose: () => void;
}

const AIIntegratedChat: React.FC<AIIntegratedChatProps> = ({ isVisible, onClose }) => {
  const { state, dispatch } = useGame();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    message: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>>([]);

  // Wire "Ask Tutor" functionality
  const handleAskTutor = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Use AI Integration Service to call POST /ask
      const response = await aiIntegrationService.askTutor(userMessage.message);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        message: response,
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, aiMessage]);
      
      // Award XP for interaction
      dispatch({ type: 'EARN_XP', payload: 5 });
    } catch (error) {
      console.error('Error asking tutor:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        message: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskTutor();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ask Your AI Tutor</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Ask me anything about dental procedures, anatomy, or case studies!</p>
            </div>
          )}

          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  chat.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{chat.message}</p>
                <p className={`text-xs mt-1 ${
                  chat.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {chat.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-gray-600">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about dental procedures, anatomy, cases..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleAskTutor}
              disabled={!message.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntegratedChat;