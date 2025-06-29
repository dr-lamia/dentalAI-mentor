import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { websocketService } from '../../services/websocketService';
import { useGame } from '../../contexts/GameContext';

interface AIAnswerValidatorProps {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswerValidated: (result: {isCorrect: boolean, score: number, feedback: string}) => void;
}

const AIAnswerValidator: React.FC<AIAnswerValidatorProps> = ({
  questionId,
  question,
  options,
  correctAnswer,
  onAnswerValidated
}) => {
  const { state } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{isCorrect: boolean, score: number, feedback: string} | null>(null);

  // Connect "Submit Answer" to POST /validate_answer
  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || isValidating) return;

    setIsValidating(true);

    try {
      // Use AI Integration Service to validate answer
      const result = await aiIntegrationService.validateAnswer(
        questionId,
        selectedAnswer,
        state.user.id
      );

      setValidationResult(result);
      onAnswerValidated(result);

      // Send real-time score update via WebSocket
      websocketService.sendScoreUpdate(
        state.user.id,
        result.score,
        questionId
      );

    } catch (error) {
      console.error('Error validating answer:', error);
      const errorResult = {
        isCorrect: false,
        score: 0,
        feedback: 'Error validating answer. Please try again.'
      };
      setValidationResult(errorResult);
      onAnswerValidated(errorResult);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{question}</h3>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => !validationResult && setSelectedAnswer(index)}
              disabled={validationResult !== null}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                validationResult
                  ? index === correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : selectedAnswer === index && index !== correctAnswer
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50'
                  : selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {validationResult && index === correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {validationResult && selectedAnswer === index && index !== correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!validationResult && (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || isValidating}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isValidating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Validating Answer...</span>
              </>
            ) : (
              <span>Submit Answer</span>
            )}
          </button>
        )}

        {/* Validation Result */}
        {validationResult && (
          <div className={`p-4 rounded-lg border ${
            validationResult.isCorrect
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {validationResult.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${
                validationResult.isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationResult.isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
              <span className={`text-sm ${
                validationResult.isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                ({validationResult.score > 0 ? '+' : ''}{validationResult.score} points)
              </span>
            </div>
            <p className={`text-sm ${
              validationResult.isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {validationResult.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnswerValidator;