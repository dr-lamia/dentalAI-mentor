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
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-8 h-8" />
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
            className="fixed right-6 bottom-24 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">👨‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{aiAvatar.name}</h3>
                    <p className="text-sm text-blue-100 capitalize">{aiAvatar.specialty} Expert</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={isSpeaking ? stopSpeaking : undefined}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👨‍⚕️</div>
                  <p className="text-gray-600 mb-4">Hello! I'm Dr. DentalMentor, ready to help you learn!</p>
                  <div className="grid grid-cols-2 gap-2">
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
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      chat.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
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
                  <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-500 text-sm">DentalMentor is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
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
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-xl transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    if (currentMessage.trim()) {
                      handleUserMessage(currentMessage);
                      setCurrentMessage('');
                    }
                  }}
                  disabled={isProcessing}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
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