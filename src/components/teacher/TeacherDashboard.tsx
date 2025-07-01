import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Users, BarChart3, Settings, Plus, BookOpen, Calendar, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Award, Bell } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import DocumentUpload from './DocumentUpload';
import ContentCreator from './ContentCreator';
import StudentProgress from './StudentProgress';
import EventManager from './EventManager';

const TeacherDashboard: React.FC = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<'upload' | 'create' | 'progress' | 'events' | 'overview'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New student joined your course', time: '2 hours ago', read: false },
    { id: 2, message: 'Quiz results are ready for review', time: '1 day ago', read: false },
    { id: 3, message: 'Upcoming webinar: Digital Dentistry', time: '2 days ago', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock statistics
  const stats = [
    { label: 'Active Students', value: 42, icon: Users, color: 'blue', trend: '+12%' },
    { label: 'Learning Resources', value: 28, icon: BookOpen, color: 'green', trend: '+5%' },
    { label: 'Avg. Completion Rate', value: '78%', icon: CheckCircle, color: 'purple', trend: '+3%' },
    { label: 'Upcoming Events', value: 5, icon: Calendar, color: 'orange', trend: '+2' }
  ];

  // Mock recent activities
  const recentActivities = [
    { id: 1, student: 'Alex Chen', action: 'Completed Root Canal Module', time: '2 hours ago', score: '92%' },
    { id: 2, student: 'Sarah Johnson', action: 'Submitted Case Study Response', time: '3 hours ago', score: '85%' },
    { id: 3, student: 'Michael Rodriguez', action: 'Started Crown Preparation Quiz', time: '5 hours ago', score: 'In Progress' },
    { id: 4, student: 'Emily Zhang', action: 'Joined Periodontics Study Group', time: '1 day ago', score: 'N/A' },
    { id: 5, student: 'David Kim', action: 'Viewed Endodontic Lecture', time: '1 day ago', score: 'N/A' }
  ];

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <DocumentUpload />;
      case 'create':
        return <ContentCreator />;
      case 'progress':
        return <StudentProgress />;
      case 'events':
        return <EventManager />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Dr. {state.user.name}! 👋</h1>
                  <p className="text-blue-100 text-base md:text-lg">Your students have been making great progress this week.</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                      <Users className="w-4 h-4" />
                      <span>42 Active Students</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                      <Award className="w-4 h-4" />
                      <span>78% Avg. Completion</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Content</span>
                  </button>
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
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {stat.trend}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Student Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Student Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Student Activity</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Activity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {activity.student.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">{activity.student}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{activity.action}</td>
                          <td className="py-3 px-4 text-gray-500 text-sm">{activity.time}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.score === 'N/A' ? 'bg-gray-100 text-gray-600' :
                              activity.score === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              parseInt(activity.score) >= 90 ? 'bg-green-100 text-green-700' :
                              parseInt(activity.score) >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {activity.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setActiveTab('progress')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Activity
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-4">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Upload Resources</h4>
                      <p className="text-sm text-gray-500">Add lecture notes and materials</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('create')}
                    className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
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
                    onClick={() => setActiveTab('events')}
                    className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-4">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Schedule Event</h4>
                      <p className="text-sm text-gray-500">Create webinars and sessions</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('progress')}
                    className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center mr-4">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">View Analytics</h4>
                      <p className="text-sm text-gray-500">Track student performance</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Resources & Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Resources */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Resources</h3>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Root Canal Therapy Guide', type: 'PDF', size: '2.4 MB', downloads: 18, date: '2 days ago' },
                    { title: 'Crown Preparation Checklist', type: 'DOCX', size: '1.1 MB', downloads: 24, date: '3 days ago' },
                    { title: 'Periodontal Disease Classification', type: 'PDF', size: '3.8 MB', downloads: 12, date: '5 days ago' }
                  ].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{resource.title}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{resource.type}</span>
                            <span>{resource.size}</span>
                            <span>{resource.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Live Webinar: Digital Dentistry', date: 'June 15, 2025', time: '2:00 PM - 4:00 PM', attendees: 42 },
                    { title: 'Case Study Discussion: Complex Restorations', date: 'June 18, 2025', time: '6:30 PM - 8:00 PM', attendees: 28 },
                    { title: 'Hands-on Workshop: Dental Photography', date: 'June 22, 2025', time: '9:00 AM - 12:00 PM', attendees: 15 }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{event.attendees} attending</span>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DentalMentor</h1>
                <p className="text-sm text-gray-500">Teacher Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Dr. {state.user.name}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {state.user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap space-x-1 sm:space-x-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'upload', label: 'Resources', icon: Upload },
              { id: 'create', label: 'Create Content', icon: Plus },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'progress', label: 'Student Progress', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base mb-2 sm:mb-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
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