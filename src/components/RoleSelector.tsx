import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Upload } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const RoleSelector: React.FC = () => {
  const { dispatch } = useApp();

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    dispatch({ type: 'SET_ROLE', payload: role });
    
    // Set mock user based on role
    const mockUser = {
      id: role === 'teacher' ? 'teacher-1' : 'student-1',
      name: role === 'teacher' ? 'Dr. Sarah Johnson' : 'Alex Chen',
      role,
      email: role === 'teacher' ? 'sarah.johnson@university.edu' : 'alex.chen@student.edu',
      joinedAt: new Date()
    };
    
    dispatch({ type: 'SET_USER', payload: mockUser });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to EduDash</h1>
            <p className="text-xl text-gray-600">Your AI-powered teaching and learning companion</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teacher Role */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleRoleSelect('teacher')}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Teacher</h2>
              <p className="text-gray-600 mb-6">Create content, upload documents, and manage student progress</p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Upload lecture notes and materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Generate quizzes and case studies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Track student performance</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Student Role */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleRoleSelect('student')}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Student</h2>
              <p className="text-gray-600 mb-6">Learn with AI-powered modules, quizzes, and personalized assistance</p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Interactive Q&A sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Auto-generated study modules</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Personalized learning experience</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Powered by Google Gemini AI • Secure • Educational
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelector;