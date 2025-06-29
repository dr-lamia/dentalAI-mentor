import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Lightbulb, BookOpen, FileQuestion, Stethoscope } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { geminiService } from '../../services/geminiService';
import { ChatMessage } from '../../types';

const ChatInterface: React.FC = () => {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setInput('');
    setIsTyping(true);

    try {
      const response = await geminiService.answerQuestion(input);
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: assistantMessage });
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const quickActions = [
    { text: 'Explain crown preparation steps', icon: BookOpen },
    { text: 'Generate a quiz on endodontics', icon: FileQuestion },
    { text: 'Create a case study about periodontal disease', icon: Stethoscope },
    { text: 'What are the principles of tooth preparation?', icon: Lightbulb }
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">EduDash AI Assistant</h2>
            <p className="text-purple-100">Ask me anything about your studies!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {state.chatMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hello! I'm EduDash</h3>
            <p className="text-gray-600 mb-6">Your friendly AI teaching assistant. What would you like to study today?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickAction(action.text)}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{action.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {state.chatMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-purple-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-purple-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;