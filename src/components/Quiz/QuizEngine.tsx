import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Award, Zap, Brain, Target } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Question, QuizResult } from '../../types';

interface QuizEngineProps {
  questions: Question[];
  onComplete: (result: QuizResult) => void;
  timeLimit?: number;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions, onComplete, timeLimit = 300 }) => {
  const { state, dispatch } = useGame();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [answers, setAnswers] = useState<Array<{questionId: string, selectedAnswer: number, isCorrect: boolean, timeSpent: number}>>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      completeQuiz();
    }
  }, [timeRemaining]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    const answerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setAnswers(prev => [...prev, answerRecord]);

    // Award/deduct points immediately
    if (isCorrect) {
      dispatch({ type: 'EARN_XP', payload: currentQuestion.points });
    } else {
      dispatch({ type: 'EARN_XP', payload: -1 });
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = answers.length - correctAnswers;
    const totalTimeSpent = timeLimit - timeRemaining;
    const accuracy = (correctAnswers / questions.length) * 100;
    const score = answers.reduce((sum, answer) => sum + (answer.isCorrect ? currentQuestion.points : 0), 0);

    // Award badges based on performance
    const badges = [];
    if (accuracy >= 95) {
      badges.push({
        id: `perfectionist-${Date.now()}`,
        name: 'Perfectionist',
        description: 'Achieved 95%+ accuracy',
        icon: '🎯',
        earnedAt: new Date(),
        rarity: 'legendary' as const,
        color: 'text-yellow-500'
      });
    } else if (accuracy >= 80) {
      badges.push({
        id: `scholar-${Date.now()}`,
        name: 'Scholar',
        description: 'Achieved 80%+ accuracy',
        icon: '📚',
        earnedAt: new Date(),
        rarity: 'epic' as const,
        color: 'text-purple-500'
      });
    }

    if (totalTimeSpent < timeLimit * 0.5) {
      badges.push({
        id: `speed-demon-${Date.now()}`,
        name: 'Speed Demon',
        description: 'Completed quiz in record time',
        icon: '⚡',
        earnedAt: new Date(),
        rarity: 'rare' as const,
        color: 'text-blue-500'
      });
    }

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      xpEarned: score,
      badges,
      timeSpent: totalTimeSpent,
      correctAnswers,
      incorrectAnswers,
      accuracy
    };

    // Award badges
    badges.forEach(badge => {
      dispatch({ type: 'EARN_BADGE', payload: badge });
    });

    onComplete(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnswerColor = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300';
    }
    
    if (index === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-800';
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-50 text-red-800';
    }
    
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Quiz Progress Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="space-y-6">
          {/* Timer */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${timeRemaining < 60 ? 'text-red-500' : 'text-blue-600'}`}>
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-gray-500">Time Remaining</p>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-800">{answers.filter(a => a.isCorrect).length}</div>
              <div className="text-xs text-green-600">Correct</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-red-800">{answers.filter(a => !a.isCorrect).length}</div>
              <div className="text-xs text-red-600">Incorrect</div>
            </div>
          </div>

          {/* Question Overview */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Question Overview</h3>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded text-xs font-bold flex items-center justify-center ${
                    index < currentQuestionIndex
                      ? answers[index]?.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : index === currentQuestionIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Difficulty</span>
              </div>
              <span className="text-sm text-blue-700 capitalize">{currentQuestion.difficulty}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Specialty</span>
              </div>
              <span className="text-sm text-purple-700 capitalize">{currentQuestion.specialty}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Points</span>
              </div>
              <span className="text-sm text-yellow-700">{currentQuestion.points} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col">
        {/* Question Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {currentQuestion.specialty} • {currentQuestion.difficulty} • {currentQuestion.points} points
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className={`font-mono text-lg ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Question Text */}
            <div>
              <h3 className="text-xl text-gray-900 leading-relaxed mb-6">
                {currentQuestion.question}
              </h3>
              
              {/* Question Image/X-ray if available */}
              {(currentQuestion.imageUrl || currentQuestion.xrayUrl) && (
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-xl p-4 flex justify-center">
                    {currentQuestion.imageUrl && (
                      <img
                        src={currentQuestion.imageUrl}
                        alt="Clinical image"
                        className="max-h-64 rounded-lg shadow-md"
                      />
                    )}
                    {currentQuestion.xrayUrl && (
                      <img
                        src={currentQuestion.xrayUrl}
                        alt="X-ray image"
                        className="max-h-64 rounded-lg shadow-md border-2 border-blue-300"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${getAnswerColor(index)}`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showExplanation && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-500 ml-4" />
                    )}
                    {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-500 ml-4" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 rounded-xl p-6 border border-blue-200"
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
                      <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex justify-between">
            <button
              onClick={() => completeQuiz()}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              End Quiz
            </button>
            
            {!showExplanation ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;