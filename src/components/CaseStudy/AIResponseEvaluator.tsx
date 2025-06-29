import React, { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

interface AIResponseEvaluatorProps {
  questionId: string;
  question: string;
  expectedAnswer: string;
  onResponseEvaluated: (result: {score: number, feedback: string}) => void;
}

const AIResponseEvaluator: React.FC<AIResponseEvaluatorProps> = ({
  questionId,
  question,
  expectedAnswer,
  onResponseEvaluated
}) => {
  const { state } = useGame();
  const [response, setResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{score: number, feedback: string} | null>(null);

  // Connect to POST /validate_answer for open-ended responses
  const handleSubmitResponse = async () => {
    if (!response.trim() || isEvaluating) return;

    setIsEvaluating(true);

    try {
      // Use AI Integration Service to validate answer
      const result = await aiIntegrationService.validateAnswer(
        questionId,
        response,
        state.user.id
      );

      setEvaluationResult(result);
      onResponseEvaluated(result);

      // Send real-time score update via WebSocket
      // This would be handled by the parent component
    } catch (error) {
      console.error('Error evaluating response:', error);
      const errorResult = {
        score: 0,
        feedback: 'Error evaluating response. Please try again.'
      };
      setEvaluationResult(errorResult);
      onResponseEvaluated(errorResult);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{question}</h3>

        {/* Response Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Response
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={!!evaluationResult}
            placeholder="Enter your detailed response..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={6}
          />
        </div>

        {/* Submit Button */}
        {!evaluationResult && (
          <button
            onClick={handleSubmitResponse}
            disabled={!response.trim() || isEvaluating}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isEvaluating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Evaluating Response...</span>
              </>
            ) : (
              <span>Submit Response</span>
            )}
          </button>
        )}

        {/* Evaluation Result */}
        {evaluationResult && (
          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">
                Response Evaluated
              </span>
              <span className="text-sm text-green-600">
                Score: {evaluationResult.score}%
              </span>
            </div>
            <p className="text-sm text-green-700">
              {evaluationResult.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResponseEvaluator;