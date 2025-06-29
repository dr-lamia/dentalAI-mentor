import React, { useState } from 'react';
import { Stethoscope, Loader } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

interface AICaseStudyGeneratorProps {
  onCaseStudyGenerated: (caseStudy: any) => void;
  availableTopics: string[];
}

const AICaseStudyGenerator: React.FC<AICaseStudyGeneratorProps> = ({ 
  onCaseStudyGenerated, 
  availableTopics 
}) => {
  const { dispatch } = useGame();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  // Link "Generate Case Study" to GET /generate_case?topic={selectedTopic}
  const handleGenerateCaseStudy = async () => {
    if (!selectedTopic || isGenerating) return;

    setIsGenerating(true);

    try {
      // Use AI Integration Service to call the API
      const caseStudy = await aiIntegrationService.generateCaseStudy(selectedTopic, difficulty);
      
      // Pass generated case study to parent component
      onCaseStudyGenerated(caseStudy);
      
      // Award XP for generating content
      dispatch({ type: 'EARN_XP', payload: 15 });
    } catch (error) {
      console.error('Error generating case study:', error);
      // Handle error - could show toast notification
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Generate Case Study</h3>
          <p className="text-sm text-gray-600">Create AI-powered clinical case studies</p>
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
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isGenerating}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateCaseStudy}
          disabled={!selectedTopic || isGenerating}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating Case Study...</span>
            </>
          ) : (
            <>
              <Stethoscope className="w-5 h-5" />
              <span>Generate Case Study</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AICaseStudyGenerator;