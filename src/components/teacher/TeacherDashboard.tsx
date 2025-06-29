import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Users, BarChart3, Settings, Plus, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import DocumentUpload from './DocumentUpload';
import ContentCreator from './ContentCreator';
import StudentProgress from './StudentProgress';

const TeacherDashboard: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'upload' | 'create' | 'progress' | 'overview'>('overview');

  const stats = [
    { label: 'Uploaded Documents', value: state.documents.length, icon: FileText, color: 'blue' },
    { label: 'Created Modules', value: state.modules.length, icon: BookOpen, color: 'green' },
    { label: 'Generated Quizzes', value: state.quizzes.length, icon: BarChart3, color: 'purple' },
    { label: 'Case Studies', value: state.caseStudies.length, icon: Users, color: 'orange' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <DocumentUpload />;
      case 'create':
        return <ContentCreator />;
      case 'progress':
        return <StudentProgress />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {state.currentUser?.name}! 👋</h1>
              <p className="text-blue-100 text-lg">Ready to create engaging educational content today?</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-4">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Upload Documents</h4>
                    <p className="text-sm text-gray-500">Add lecture notes and materials</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('create')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center mr-4">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Create Content</h4>
                    <p className="text-sm text-gray-500">Generate quizzes and modules</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('progress')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-4">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">View Progress</h4>
                    <p className="text-sm text-gray-500">Track student performance</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {state.documents.length === 0 && state.modules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Get Started</h4>
                  <p className="text-gray-500 mb-4">Upload your first document or create content to begin</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Upload Documents
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...state.documents, ...state.modules].slice(-5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {'content' in item ? <BookOpen className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{'title' in item ? item.title : item.name}</p>
                          <p className="text-sm text-gray-500">
                            {'uploadedAt' in item ? `Uploaded ${item.uploadedAt.toLocaleDateString()}` : `Created ${item.createdAt.toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ED</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduDash</h1>
                <p className="text-sm text-gray-500">Teacher Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{state.currentUser?.name}</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
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
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'upload', label: 'Upload Documents', icon: Upload },
              { id: 'create', label: 'Create Content', icon: Plus },
              { id: 'progress', label: 'Student Progress', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
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

export default TeacherDashboard;