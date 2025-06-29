import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, Play, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Module } from '../../types';
import ReactMarkdown from 'react-markdown';

const ModuleViewer: React.FC = () => {
  const { state } = useApp();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);

  const startModule = (module: Module) => {
    setSelectedModule(module);
    setShowQuestions(false);
    setCurrentQuestionIndex(0);
  };

  const startQuestions = () => {
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
  };

  const nextQuestion = () => {
    if (!selectedModule) return;
    
    if (currentQuestionIndex < selectedModule.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Module completed
      setSelectedModule(null);
      setShowQuestions(false);
    }
  };

  if (selectedModule) {
    if (showQuestions && selectedModule.questions.length > 0) {
      const currentQuestion = selectedModule.questions[currentQuestionIndex];
      
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Practice Question</h2>
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {selectedModule.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Answer & Explanation</h4>
              <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Modules
              </button>
              
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                {currentQuestionIndex < selectedModule.questions.length - 1 ? 'Next Question' : 'Complete Module'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedModule(null)}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center space-x-1"
            >
              <span>← Back to Modules</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedModule.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{selectedModule.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedModule.estimatedTime} minutes</span>
              </div>
              <span className="capitalize">{selectedModule.difficulty}</span>
              <span className="capitalize">{selectedModule.subject}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <ReactMarkdown>{selectedModule.content}</ReactMarkdown>
          </div>

          {selectedModule.questions.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Questions</h3>
                  <p className="text-gray-600">Test your understanding with {selectedModule.questions.length} practice questions</p>
                </div>
                <button
                  onClick={startQuestions}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Practice</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Modules</h2>
        <p className="text-gray-600">Comprehensive study materials with practice questions</p>
      </div>

      {state.modules.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Available</h3>
          <p className="text-gray-500 mb-4">Ask your teacher to create some learning modules, or request them through the chat!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.modules.map((module) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => startModule(module)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {module.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{module.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimatedTime} min</span>
                </div>
                <span className="capitalize">{module.subject}</span>
              </div>

              {module.questions.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-blue-600 mb-4">
                  <CheckCircle className="w-3 h-3" />
                  <span>{module.questions.length} practice questions included</span>
                </div>
              )}

              <button className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleViewer;