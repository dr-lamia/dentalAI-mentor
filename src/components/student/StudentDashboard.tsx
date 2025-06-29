import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, FileQuestion, Stethoscope, TrendingUp, Clock, Award, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import ChatInterface from './ChatInterface';
import QuizInterface from './QuizInterface';
import ModuleViewer from './ModuleViewer';
import CaseStudyInterface from './CaseStudyInterface';

const StudentDashboard: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'module' | 'case-study' | 'overview'>('overview');

  // Mock student progress data
  const studentProgress = {
    level: 3,
    xp: 1250,
    totalPoints: 1450,
    completedModules: 8,
    studyStreak: 7,
    studyTime: 24,
    averageScore: 85
  };

  const stats = [
    { label: 'Study Streak', value: `${studentProgress.studyStreak} days`, icon: TrendingUp, color: 'blue' },
    { label: 'Modules Completed', value: studentProgress.completedModules, icon: BookOpen, color: 'green' },
    { label: 'Study Time', value: `${studentProgress.studyTime}h`, icon: Clock, color: 'purple' },
    { label: 'Average Score', value: `${studentProgress.averageScore}%`, icon: Award, color: 'orange' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'quiz':
        return <QuizInterface />;
      case 'module':
        return <ModuleViewer />;
      case 'case-study':
        return <CaseStudyInterface />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {state.currentUser?.name}! 👋</h1>
              <p className="text-purple-100 text-lg">What would you like to study today?</p>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Level {studentProgress.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">{studentProgress.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colorClasses = {
                  blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
                  green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
                  purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600',
                  orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600'
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Learning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Ask EduDash</h4>
                  <p className="text-sm text-gray-500 text-center">Get instant answers to your questions</p>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-3">
                    <FileQuestion className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Take Quiz</h4>
                  <p className="text-sm text-gray-500 text-center">Test your knowledge with AI-generated quizzes</p>
                </button>

                <button
                  onClick={() => setActiveTab('module')}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Study Module</h4>
                  <p className="text-sm text-gray-500 text-center">Learn with structured content</p>
                </button>

                <button
                  onClick={() => setActiveTab('case-study')}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-3">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Case Study</h4>
                  <p className="text-sm text-gray-500 text-center">Practice with real scenarios</p>
                </button>
              </div>
            </div>

            {/* Available Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Topics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {state.availableTopics.map((topic, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveTab('chat')}
                    className="p-3 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ED</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduDash</h1>
                <p className="text-sm text-gray-500">Student Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{state.currentUser?.name}</p>
                <p className="text-xs text-gray-500">Level {studentProgress.level} • {studentProgress.xp} XP</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {state.currentUser?.name?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'chat', label: 'Ask EduDash', icon: MessageSquare },
              { id: 'quiz', label: 'Quizzes', icon: FileQuestion },
              { id: 'module', label: 'Modules', icon: BookOpen },
              { id: 'case-study', label: 'Case Studies', icon: Stethoscope }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;