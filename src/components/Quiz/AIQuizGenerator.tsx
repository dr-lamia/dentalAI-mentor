import React, { useState } from 'react';
import { FileQuestion, Loader, Play } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

interface AIQuizGeneratorProps {
  onQuizGenerated: (quiz: any) => void;
  availableTopics: string[];
}

const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({ onQuizGenerated, availableTopics }) => {
  const { dispatch } = useGame();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Link "Generate Quiz" to GET /generate_quiz?topic={selectedTopic}
  const handleGenerateQuiz = async () => {
    if (!selectedTopic || isGenerating) return;

    setIsGenerating(true);

    try {
      // Use AI Integration Service to call the API
      const quiz = await aiIntegrationService.generateQuiz(selectedTopic, difficulty, numQuestions);
      
      // Pass generated quiz to parent component
      onQuizGenerated(quiz);
      
      // Award XP for generating content
      dispatch({ type: 'EARN_XP', payload: 10 });
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Handle error - could show toast notification
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileQuestion className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Generate Quiz</h3>
          <p className="text-sm text-gray-600">Create AI-powered quizzes on any dental topic</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isGenerating}
          >
            <option value="">Choose a topic...</option>
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isGenerating}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isGenerating}
          >
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateQuiz}
          disabled={!selectedTopic || isGenerating}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating Quiz...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Generate Quiz</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIQuizGenerator;