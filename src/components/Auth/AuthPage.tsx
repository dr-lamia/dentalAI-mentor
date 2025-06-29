import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
              <span className="text-white font-bold text-2xl">DM</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">DentalMentor</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The most advanced interactive dental education platform with AI-powered learning, 3D simulations, and real-time collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">🦷</div>
              <h3 className="font-semibold text-gray-900 mb-2">3D Simulations</h3>
              <p className="text-gray-600 text-sm">Practice crown preparation and dental procedures in realistic 3D environments</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600 text-sm">Get personalized feedback and guidance from our advanced AI mentor</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Collaboration</h3>
              <p className="text-gray-600 text-sm">Join study groups and learn together with peers from around the world</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">Monitor your learning journey with detailed analytics and achievements</p>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Forms */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;