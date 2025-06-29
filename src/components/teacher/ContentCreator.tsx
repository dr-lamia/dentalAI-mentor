import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileQuestion, Stethoscope, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { geminiService } from '../../services/geminiService';

const ContentCreator: React.FC = () => {
  const { state, dispatch } = useApp();
  const [contentType, setContentType] = useState<'quiz' | 'module' | 'case-study'>('quiz');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'>('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationStatus('idle');

    try {
      switch (contentType) {
        case 'quiz':
          const quiz = await geminiService.generateQuiz(topic, difficulty as 'easy' | 'medium' | 'hard', numQuestions);
          dispatch({ type: 'ADD_QUIZ', payload: quiz });
          break;
        
        case 'module':
          const module = await geminiService.generateModule(topic, difficulty as 'beginner' | 'intermediate' | 'advanced');
          dispatch({ type: 'ADD_MODULE', payload: module });
          break;
        
        case 'case-study':
          const caseStudy = await geminiService.generateCaseStudy(topic, difficulty as 'easy' | 'medium' | 'hard');
          dispatch({ type: 'ADD_CASE_STUDY', payload: caseStudy });
          break;
      }
      
      setGenerationStatus('success');
      setTopic('');
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const contentTypes = [
    {
      id: 'quiz',
      name: 'Quiz',
      description: 'Multiple choice questions with explanations',
      icon: FileQuestion,
      color: 'blue'
    },
    {
      id: 'module',
      name: 'Learning Module',
      description: 'Comprehensive study material with practice questions',
      icon: BookOpen,
      color: 'green'
    },
    {
      id: 'case-study',
      name: 'Case Study',
      description: 'Patient scenarios with open-ended questions',
      icon: Stethoscope,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Content</h2>
        <p className="text-gray-600">Generate AI-powered educational content based on your uploaded materials</p>
      </div>

      {/* Content Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = contentType === type.id;
            
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setContentType(type.id as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    type.color === 'blue' ? 'bg-blue-100' :
                    type.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      type.color === 'blue' ? 'text-blue-600' :
                      type.color === 'green' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Crown Preparation, Endodontic Treatment"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {state.documents.length > 0 ? 'AI will use your uploaded documents as reference' : 'Upload documents for better context'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {contentType === 'module' ? (
                <>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </>
              ) : (
                <>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </>
              )}
            </select>
          </div>

          {contentType === 'quiz' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate {contentTypes.find(t => t.id === contentType)?.name}</span>
            )}
          </button>
        </div>
      </div>

      {/* Generation Status */}
      <AnimatePresence>
        {generationStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              generationStatus === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {generationStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {generationStatus === 'success'
                  ? 'Content generated successfully!'
                  : 'Failed to generate content. Please try again.'
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Content Preview */}
      {(state.quizzes.length > 0 || state.modules.length > 0 || state.caseStudies.length > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quizzes */}
            {state.quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <FileQuestion className="w-5 h-5 text-blue-600" />
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Quiz</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{quiz.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{quiz.questions.length} questions</span>
                  <span>{quiz.createdAt.toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}

            {/* Modules */}
            {state.modules.map((module) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Module</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{module.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{module.estimatedTime} min</span>
                  <span>{module.createdAt.toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}

            {/* Case Studies */}
            {state.caseStudies.map((caseStudy) => (
              <motion.div
                key={caseStudy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Case Study</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{caseStudy.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{caseStudy.patientHistory}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{caseStudy.questions.length} questions</span>
                  <span>{caseStudy.createdAt.toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreator;