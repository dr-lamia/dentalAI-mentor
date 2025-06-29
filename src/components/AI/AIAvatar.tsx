import React, { useState, useEffect } from 'react';
import { MessageCircle, Volume2, VolumeX, Settings, Mic, MicOff } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { dentalMentorService } from '../../services/dentalMentorService';

interface AIAvatarProps {
  isVisible: boolean;
  onToggle: () => void;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ isVisible, onToggle }) => {
  const { state, dispatch } = useGame();
  const { aiAvatar } = state;
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, message: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        handleUserMessage("Tell me about endodontics");
      }, 2000);
    }
  };

  const handleUserMessage = async (message: string) => {
    const newUserMessage = {
      id: Date.now().toString(),
      message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsProcessing(true);
    
    try {
      // Use DentalMentor service for AI response
      const response = await dentalMentorService.answerStudentQuestion(message);
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        message: response,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
      speakMessage(response);
      
      // Award XP for interaction
      dispatch({ type: 'EARN_XP', payload: 5 });
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm having trouble processing your question right now. Please try again!",
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.pitch = aiAvatar.voiceSettings.pitch;
      utterance.rate = aiAvatar.voiceSettings.speed;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* AI Avatar Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.button>

      {/* AI Avatar Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-2 bottom-16 sm:right-6 sm:bottom-24 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40 max-h-[calc(100vh-100px)]"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">👨‍⚕️</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{aiAvatar.name}</h3>
                    <p className="text-xs sm:text-sm text-blue-100 capitalize truncate">{aiAvatar.specialty} Expert</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={isSpeaking ? stopSpeaking : undefined}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-4 sm:py-8">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">👨‍⚕️</div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Hello! I'm Dr. DentalMentor, ready to help you learn!</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Ask about Endodontics',
                      'Crown Preparation Guide',
                      'Periodontal Treatment',
                      'Case Study Help'
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleUserMessage(suggestion)}
                        className="p-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 sm:p-3 rounded-2xl ${
                      chat.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{chat.message}</p>
                    <p className={`text-xs mt-1 ${
                      chat.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {chat.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-2 sm:p-3 rounded-2xl bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-500 text-xs sm:text-sm">DentalMentor is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything about dentistry..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && currentMessage.trim()) {
                      handleUserMessage(currentMessage);
                      setCurrentMessage('');
                    }
                  }}
                  className="flex-1 p-2 sm:p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 sm:p-3 rounded-xl transition-colors flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
                <button
                  onClick={() => {
                    if (currentMessage.trim()) {
                      handleUserMessage(currentMessage);
                      setCurrentMessage('');
                    }
                  }}
                  disabled={isProcessing}
                  className="p-2 sm:p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAvatar;