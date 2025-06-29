import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4 sm:mb-6">
              <span className="text-white font-bold text-xl sm:text-2xl">DM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">DentalMentor</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
              The most advanced interactive dental education platform with AI-powered learning, 3D simulations, and real-time collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🦷</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">3D Simulations</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Practice crown preparation and dental procedures in realistic 3D environments</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">AI-Powered Learning</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Get personalized feedback and guidance from our advanced AI mentor</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Real-time Collaboration</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Join study groups and learn together with peers from around the world</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Progress Tracking</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Monitor your learning journey with detailed analytics and achievements</p>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Forms */}
        <div className="flex justify-center order-1 lg:order-2">
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