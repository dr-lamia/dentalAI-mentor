import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Clock, FileText, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { CaseStudy, CaseStudyResult } from '../../types';
import { geminiService } from '../../services/geminiService';

const CaseStudyInterface: React.FC = () => {
  const { state } = useApp();
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [responses, setResponses] = useState<Array<{questionId: string, response: string, score: number, feedback: string}>>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [caseResult, setCaseResult] = useState<CaseStudyResult | null>(null);

  const startCase = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
    setCurrentQuestionIndex(0);
    setResponse('');
    setResponses([]);
    setCaseResult(null);
  };

  const submitResponse = async () => {
    if (!response.trim() || !selectedCase) return;

    setIsEvaluating(true);
    const currentQuestion = selectedCase.questions[currentQuestionIndex];

    try {
      const evaluation = await geminiService.evaluateResponse(
        currentQuestion.question,
        response,
        currentQuestion.explanation
      );

      const responseRecord = {
        questionId: currentQuestion.id,
        response,
        score: evaluation.score,
        feedback: evaluation.feedback
      };

      setResponses(prev => [...prev, responseRecord]);
      setResponse('');

      if (currentQuestionIndex < selectedCase.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeCase([...responses, responseRecord]);
      }
    } catch (error) {
      console.error('Error evaluating response:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const completeCase = (allResponses: typeof responses) => {
    if (!selectedCase) return;

    const totalScore = Math.round(
      allResponses.reduce((sum, r) => sum + r.score, 0) / allResponses.length
    );

    const result: CaseStudyResult = {
      id: `result-${Date.now()}`,
      caseStudyId: selectedCase.id,
      studentId: state.currentUser?.id || 'unknown',
      responses: allResponses.map(r => ({
        questionId: r.questionId,
        response: r.response,
        score: r.score,
        feedback: r.feedback
      })),
      score: totalScore,
      completedAt: new Date()
    };

    setCaseResult(result);
  };

  const resetCase = () => {
    setSelectedCase(null);
    setCurrentQuestionIndex(0);
    setResponse('');
    setResponses([]);
    setCaseResult(null);
  };

  if (caseResult && selectedCase) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {caseResult.score >= 80 ? '🎉' : caseResult.score >= 60 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Case Study Complete!</h2>
            <p className="text-xl text-gray-600">Overall Score: {caseResult.score}%</p>
          </div>

          <div className="space-y-6 mb-8">
            {caseResult.responses.map((resp, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Question {index + 1} - Score: {resp.score}%
                </h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Response:</h4>
                  <p className="text-gray-600 bg-white p-3 rounded-lg">{resp.response}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback:</h4>
                  <p className="text-gray-600">{resp.feedback}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={resetCase}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Try Another Case Study
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedCase) {
    const currentQuestion = selectedCase.questions[currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Case Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{selectedCase.title}</h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {selectedCase.questions.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Patient History</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{selectedCase.patientHistory}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Clinical Findings</h3>
              <ul className="space-y-1">
                {selectedCase.clinicalFindings.map((finding, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span className="text-gray-600">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Provide a detailed response based on the case information..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={8}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={resetCase}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Exit Case Study
            </button>
            
            <button
              onClick={submitResponse}
              disabled={!response.trim() || isEvaluating}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              {isEvaluating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Response</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Previous Responses */}
        {responses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Responses</h3>
            <div className="space-y-4">
              {responses.map((resp, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Question {index + 1}</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">{resp.score}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{resp.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Studies</h2>
        <p className="text-gray-600">Practice with realistic patient scenarios and clinical decision-making</p>
      </div>

      {state.caseStudies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🩺</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Case Studies Available</h3>
          <p className="text-gray-500 mb-4">Ask your teacher to create some case studies, or request them through the chat!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.caseStudies.map((caseStudy) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => startCase(caseStudy)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  caseStudy.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  caseStudy.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {caseStudy.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">{caseStudy.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{caseStudy.patientHistory}</p>

              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-gray-900">Clinical Findings:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {caseStudy.clinicalFindings.slice(0, 3).map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-1">•</span>
                      <span className="line-clamp-1">{finding}</span>
                    </li>
                  ))}
                  {caseStudy.clinicalFindings.length > 3 && (
                    <li className="text-gray-400">+{caseStudy.clinicalFindings.length - 3} more findings</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{caseStudy.questions.length} questions</span>
                </div>
                <span className="capitalize">{caseStudy.subject}</span>
              </div>

              <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium">
                Start Case Study
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseStudyInterface;