import React from 'react';
import { User, Trophy, Bell, Settings } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const Header: React.FC = () => {
  const { state } = useGame();
  const { user } = state;

  const xpToNextLevel = ((user.level) * 100) - user.xp;
  const progressPercentage = (user.xp % 100);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">DM</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DentalMentor</h1>
            <p className="text-sm text-gray-500">Interactive Learning Platform</p>
          </div>
        </div>

        {/* User Progress */}
        <div className="flex items-center space-x-6">
          {/* XP Progress */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Level {user.level}</p>
              <p className="text-xs text-gray-500">{xpToNextLevel} XP to next level</p>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
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

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.badges.length} badges</p>
            </div>
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;