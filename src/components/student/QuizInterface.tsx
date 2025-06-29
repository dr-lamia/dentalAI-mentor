import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Quiz, QuizResult } from '../../types';

const QuizInterface: React.FC = () => {
  const { state } = useApp();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [answers, setAnswers] = useState<Array<{questionId: string, selectedAnswer: number, isCorrect: boolean}>>([]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizResult(null);
    setAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !selectedQuiz) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const answerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    };

    setAnswers(prev => [...prev, answerRecord]);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!selectedQuiz) return;

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!selectedQuiz) return;

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / selectedQuiz.questions.length) * 100);

    const result: QuizResult = {
      id: `result-${Date.now()}`,
      quizId: selectedQuiz.id,
      studentId: state.currentUser?.id || 'unknown',
      score,
      totalQuestions: selectedQuiz.questions.length,
      correctAnswers,
      timeSpent: 0,
      completedAt: new Date(),
      answers: answers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect,
        timeSpent: 0
      }))
    };

    setQuizResult(result);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizResult(null);
    setAnswers([]);
  };

  if (quizResult && selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center"
        >
          <div className="text-6xl mb-6">
            {quizResult.score >= 80 ? '🎉' : quizResult.score >= 60 ? '👍' : '📚'}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 mb-8">You scored {quizResult.score}% on "{selectedQuiz.title}"</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Correct Answers</h3>
              <p className="text-2xl font-bold text-blue-700">{quizResult.correctAnswers}</p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-red-900 mb-2">Incorrect Answers</h3>
              <p className="text-2xl font-bold text-red-700">{quizResult.totalQuestions - quizResult.correctAnswers}</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Final Score</h3>
              <p className="text-2xl font-bold text-green-700">{quizResult.score}%</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Take Another Quiz
            </button>
            
            <div>
              <button
                onClick={() => setQuizResult(null)}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Review Answers
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h2>
              <p className="text-gray-600">{selectedQuiz.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

          <div className="space-y-3 mb-8">
            {currentQuestion.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? showExplanation
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-purple-500 bg-purple-50 text-purple-800'
                    : showExplanation && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {showExplanation && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto text-green-500" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="w-5 h-5 ml-auto text-red-500" />
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
                className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
              >
                <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
                <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Exit Quiz
            </button>
            
            {!showExplanation ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
              >
                {currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Quizzes</h2>
        <p className="text-gray-600">Test your knowledge with AI-generated quizzes</p>
      </div>

      {state.quizzes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Available</h3>
          <p className="text-gray-500 mb-4">Ask your teacher to create some quizzes, or request them through the chat!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => startQuiz(quiz)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {quiz.questions.length} questions
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>~{quiz.questions.length * 2} min</span>
                </div>
                <span className="capitalize">{quiz.subject}</span>
              </div>

              <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium">
                Start Quiz
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizInterface;