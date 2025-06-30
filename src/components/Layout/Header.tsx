import React from 'react';
import { User, Trophy, Bell, Settings, Menu } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const Header: React.FC = () => {
  const { state } = useGame();
  const { user } = state;

  const xpToNextLevel = ((user.level) * 100) - user.xp;
  const progressPercentage = (user.xp % 100);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">DM</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">DentalMentor</h1>
            <p className="text-xs sm:text-sm text-gray-500">Interactive Learning Platform</p>
          </div>
        </div>

        {/* User Progress - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* XP Progress */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Level {user.level}</p>
              <p className="text-xs text-gray-500">{xpToNextLevel} XP to next level</p>
            </div>
            <div className="w-20 xl:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="font-semibold text-yellow-800">{user.totalPoints}</span>
          </div>
        </div>

        {/* Right side - Mobile optimized */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile XP display */}
          <div className="lg:hidden flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded-lg">
            <span className="text-xs font-medium text-blue-700">L{user.level}</span>
            <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=100" 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.badges.length} badges</p>
            </div>
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;