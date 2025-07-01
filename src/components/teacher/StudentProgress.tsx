import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Award, BarChart3, Search, Filter, Download, CheckCircle, XCircle, AlertTriangle, BookOpen, FileQuestion, Stethoscope } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  completedModules: number;
  totalStudyTime: number;
  lastActive: string;
  averageScore: number;
  level: number;
  xp: number;
  streak: number;
  badges: number;
  status: 'active' | 'inactive';
}

interface ModuleCompletion {
  module: string;
  completed: number;
  specialty: string;
}

interface ActivityData {
  day: string;
  students: number;
  avgScore: number;
}

const StudentProgress: React.FC = () => {
  const { state } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'quizzes' | 'cases'>('overview');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  // Mock student data
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alex Chen',
      email: 'alex.chen@student.edu',
      progress: 85,
      completedModules: 12,
      totalStudyTime: 45,
      lastActive: '2 hours ago',
      averageScore: 88,
      level: 5,
      xp: 2450,
      streak: 7,
      badges: 4,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@student.edu',
      progress: 72,
      completedModules: 9,
      totalStudyTime: 32,
      lastActive: '1 day ago',
      averageScore: 82,
      level: 4,
      xp: 1850,
      streak: 3,
      badges: 3,
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'michael.r@student.edu',
      progress: 91,
      completedModules: 15,
      totalStudyTime: 58,
      lastActive: '30 minutes ago',
      averageScore: 94,
      level: 6,
      xp: 3100,
      streak: 12,
      badges: 6,
      status: 'active'
    },
    {
      id: '4',
      name: 'Emily Zhang',
      email: 'emily.z@student.edu',
      progress: 67,
      completedModules: 8,
      totalStudyTime: 28,
      lastActive: '3 days ago',
      averageScore: 76,
      level: 3,
      xp: 1450,
      streak: 0,
      badges: 2,
      status: 'inactive'
    },
    {
      id: '5',
      name: 'David Kim',
      email: 'david.k@student.edu',
      progress: 45,
      completedModules: 5,
      totalStudyTime: 18,
      lastActive: '5 days ago',
      averageScore: 68,
      level: 2,
      xp: 950,
      streak: 0,
      badges: 1,
      status: 'inactive'
    }
  ]);

  const weeklyData: ActivityData[] = [
    { day: 'Mon', students: 12, avgScore: 85 },
    { day: 'Tue', students: 15, avgScore: 88 },
    { day: 'Wed', students: 18, avgScore: 82 },
    { day: 'Thu', students: 14, avgScore: 90 },
    { day: 'Fri', students: 20, avgScore: 87 },
    { day: 'Sat', students: 8, avgScore: 89 },
    { day: 'Sun', students: 6, avgScore: 91 }
  ];

  const moduleCompletionData: ModuleCompletion[] = [
    { module: 'Crown Preparation', completed: 85, specialty: 'prosthodontics' },
    { module: 'Root Canal Therapy', completed: 72, specialty: 'endodontics' },
    { module: 'Periodontal Disease', completed: 68, specialty: 'periodontics' },
    { module: 'Oral Surgery', completed: 45, specialty: 'oral-surgery' },
    { module: 'Orthodontic Treatment', completed: 38, specialty: 'orthodontics' }
  ];

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'blue' },
    { label: 'Average Progress', value: `${Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%`, icon: TrendingUp, color: 'green' },
    { label: 'Total Study Hours', value: students.reduce((acc, s) => acc + s.totalStudyTime, 0), icon: Clock, color: 'purple' },
    { label: 'Average Score', value: `${Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%`, icon: Award, color: 'orange' }
  ];

  // Student's completed modules
  const studentModules = [
    { id: '1', name: 'Root Canal Therapy', score: 92, completedAt: '2 days ago', specialty: 'endodontics' },
    { id: '2', name: 'Crown Preparation', score: 88, completedAt: '5 days ago', specialty: 'prosthodontics' },
    { id: '3', name: 'Periodontal Examination', score: 95, completedAt: '1 week ago', specialty: 'periodontics' },
    { id: '4', name: 'Dental Implant Basics', score: 85, completedAt: '2 weeks ago', specialty: 'oral-surgery' }
  ];

  // Student's quiz results
  const studentQuizzes = [
    { id: '1', name: 'Endodontic Principles', score: 90, completedAt: '3 days ago', questions: 10, timeSpent: '12 min' },
    { id: '2', name: 'Crown Materials', score: 85, completedAt: '6 days ago', questions: 15, timeSpent: '18 min' },
    { id: '3', name: 'Periodontal Classification', score: 78, completedAt: '1 week ago', questions: 12, timeSpent: '15 min' },
    { id: '4', name: 'Dental Anatomy', score: 92, completedAt: '2 weeks ago', questions: 20, timeSpent: '25 min' }
  ];

  // Student's case studies
  const studentCases = [
    { id: '1', name: 'Complex Endodontic Case', score: 88, completedAt: '4 days ago', specialty: 'endodontics', difficulty: 'advanced' },
    { id: '2', name: 'Full Mouth Rehabilitation', score: 82, completedAt: '1 week ago', specialty: 'prosthodontics', difficulty: 'advanced' },
    { id: '3', name: 'Periodontal Surgery Case', score: 90, completedAt: '2 weeks ago', specialty: 'periodontics', difficulty: 'intermediate' }
  ];

  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Data exported as ${exportFormat.toUpperCase()} successfully!`);
    }, 1500);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'endodontics':
        return <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600">E</div>;
      case 'prosthodontics':
        return <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">P</div>;
      case 'periodontics':
        return <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">P</div>;
      case 'orthodontics':
        return <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">O</div>;
      case 'oral-surgery':
        return <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">S</div>;
      default:
        return <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">G</div>;
    }
  };

  const renderStudentDetails = () => {
    if (!selectedStudent) return null;

    switch (activeTab) {
      case 'modules':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Completed Modules</h4>
            {studentModules.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  {getSpecialtyIcon(module.specialty)}
                  <div>
                    <p className="font-medium text-gray-900">{module.name}</p>
                    <p className="text-xs text-gray-500">Completed {module.completedAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${getScoreColor(module.score)}`}>
                    {module.score}%
                  </span>
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'quizzes':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quiz Results</h4>
            {studentQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FileQuestion className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{quiz.name}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{quiz.questions} questions</span>
                      <span>{quiz.timeSpent}</span>
                      <span>Completed {quiz.completedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${getScoreColor(quiz.score)}`}>
                    {quiz.score}%
                  </span>
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'cases':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Case Study Submissions</h4>
            {studentCases.map((caseStudy) => (
              <div key={caseStudy.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <Stethoscope className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{caseStudy.name}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="capitalize">{caseStudy.specialty}</span>
                      <span className="capitalize">{caseStudy.difficulty}</span>
                      <span>Completed {caseStudy.completedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${getScoreColor(caseStudy.score)}`}>
                    {caseStudy.score}%
                  </span>
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Level</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedStudent.level}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedStudent.xp} XP</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${(selectedStudent.xp % 500) / 5}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Study Streak</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedStudent.streak}
                  </div>
                  <p className="font-medium text-gray-900">
                    {selectedStudent.streak > 0 ? `${selectedStudent.streak} day streak` : 'No active streak'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Badges Earned</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedStudent.badges}
                  </div>
                  <p className="font-medium text-gray-900">
                    {selectedStudent.badges} achievement{selectedStudent.badges !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Study Time</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-gray-900">
                    {selectedStudent.totalStudyTime} hours
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Performance Overview</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm text-gray-500">{selectedStudent.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${selectedStudent.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Average Score</span>
                      <span className={`text-sm ${getScoreColor(selectedStudent.averageScore)}`}>
                        {selectedStudent.averageScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedStudent.averageScore >= 90 ? 'bg-green-500' :
                          selectedStudent.averageScore >= 80 ? 'bg-blue-500' :
                          selectedStudent.averageScore >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${selectedStudent.averageScore}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Modules Completed</span>
                      <span className="text-sm text-gray-500">{selectedStudent.completedModules}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                        style={{ width: `${(selectedStudent.completedModules / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Activity Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Completed Root Canal Module</p>
                      <p className="text-sm text-gray-500">2 days ago • Score: 92%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <FileQuestion className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Took Endodontic Principles Quiz</p>
                      <p className="text-sm text-gray-500">3 days ago • Score: 90%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Joined Endodontics Study Group</p>
                      <p className="text-sm text-gray-500">5 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Stethoscope className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Submitted Complex Endodontic Case</p>
                      <p className="text-sm text-gray-500">1 week ago • Score: 88%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Strengths</p>
                    <p className="text-sm text-gray-600">Strong performance in Endodontics and Periodontics. Consistent study habits with a 7-day streak.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Areas for Improvement</p>
                    <p className="text-sm text-gray-600">Could benefit from more focus on Orthodontics and Oral Surgery topics where scores are lower.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Suggested Resources</p>
                    <p className="text-sm text-gray-600">Recommend assigning the "Advanced Orthodontic Principles" module and "Oral Surgery Case Studies" to strengthen these areas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Progress</h2>
          <p className="text-gray-600">Monitor student performance and engagement across all modules</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Export Data</span>
              </>
            )}
          </button>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="active">Active Students</option>
              <option value="inactive">Inactive Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Modules</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Study Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowStudentModal(true);
                  }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{student.completedModules}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{student.totalStudyTime}h</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${getScoreColor(student.averageScore)}`}>
                      {student.averageScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500">{student.lastActive}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Module Completion */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Module Completion Rates</h3>
        <div className="space-y-4">
          {moduleCompletionData.map((module, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getSpecialtyIcon(module.specialty)}
                <span className="font-medium text-gray-900">{module.module}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${module.completed}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-12">{module.completed}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showStudentModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStudentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-gray-500">{selectedStudent.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'modules', label: 'Modules' },
                    { id: 'quizzes', label: 'Quizzes' },
                    { id: 'cases', label: 'Case Studies' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-3 px-1 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              {renderStudentDetails()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProgress;