import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const StudentProgress: React.FC = () => {
  // Mock student data
  const students = [
    {
      id: '1',
      name: 'Alex Chen',
      email: 'alex.chen@student.edu',
      progress: 85,
      completedModules: 12,
      totalStudyTime: 45,
      lastActive: '2 hours ago',
      averageScore: 88
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@student.edu',
      progress: 72,
      completedModules: 9,
      totalStudyTime: 32,
      lastActive: '1 day ago',
      averageScore: 82
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'michael.r@student.edu',
      progress: 91,
      completedModules: 15,
      totalStudyTime: 58,
      lastActive: '30 minutes ago',
      averageScore: 94
    },
    {
      id: '4',
      name: 'Emily Zhang',
      email: 'emily.z@student.edu',
      progress: 67,
      completedModules: 8,
      totalStudyTime: 28,
      lastActive: '3 days ago',
      averageScore: 76
    }
  ];

  const weeklyData = [
    { day: 'Mon', students: 12, avgScore: 85 },
    { day: 'Tue', students: 15, avgScore: 88 },
    { day: 'Wed', students: 18, avgScore: 82 },
    { day: 'Thu', students: 14, avgScore: 90 },
    { day: 'Fri', students: 20, avgScore: 87 },
    { day: 'Sat', students: 8, avgScore: 89 },
    { day: 'Sun', students: 6, avgScore: 91 }
  ];

  const moduleCompletionData = [
    { module: 'Crown Prep', completed: 85 },
    { module: 'Endodontics', completed: 72 },
    { module: 'Periodontics', completed: 68 },
    { module: 'Oral Surgery', completed: 45 },
    { module: 'Orthodontics', completed: 38 }
  ];

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'blue' },
    { label: 'Average Progress', value: `${Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%`, icon: TrendingUp, color: 'green' },
    { label: 'Total Study Hours', value: students.reduce((acc, s) => acc + s.totalStudyTime, 0), icon: Clock, color: 'purple' },
    { label: 'Average Score', value: `${Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%`, icon: Award, color: 'orange' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Progress</h2>
        <p className="text-gray-600">Monitor student performance and engagement across all modules</p>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Scores Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Scores Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="avgScore" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Completion */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Completion Rates</h3>
        <div className="space-y-4">
          {moduleCompletionData.map((module, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{module.module}</span>
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

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Student Progress</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Modules</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Study Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
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
                    <span className={`font-medium ${
                      student.averageScore >= 90 ? 'text-green-600' :
                      student.averageScore >= 80 ? 'text-blue-600' :
                      student.averageScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {student.averageScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500">{student.lastActive}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;