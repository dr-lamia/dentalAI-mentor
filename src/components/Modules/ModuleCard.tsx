import React from 'react';
import { Clock, Star, Lock, CheckCircle, Play } from 'lucide-react';
import { Module } from '../../types';

interface ModuleCardProps {
  module: Module;
  onStart: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onStart }) => {
  const difficultyColors = {
    beginner: 'text-green-600 bg-green-50',
    intermediate: 'text-yellow-600 bg-yellow-50',
    advanced: 'text-red-600 bg-red-50',
  };

  const specialtyColors = {
    endodontics: 'from-blue-500 to-blue-600',
    periodontics: 'from-green-500 to-green-600',
    prosthodontics: 'from-purple-500 to-purple-600',
    orthodontics: 'from-orange-500 to-orange-600',
    pedodontics: 'from-pink-500 to-pink-600',
    'oral-surgery': 'from-red-500 to-red-600',
    'oral-medicine': 'from-teal-500 to-teal-600',
    radiology: 'from-indigo-500 to-indigo-600',
    'public-health': 'from-cyan-500 to-cyan-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Header with specialty gradient */}
      <div className={`h-32 bg-gradient-to-br ${specialtyColors[module.specialty]} relative flex items-center justify-center`}>
        <div className="text-6xl opacity-20 text-white">
          {module.icon}
        </div>
        {module.isLocked && (
          <div className="absolute top-3 right-3 bg-black/20 rounded-full p-2">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
        {module.completionRate === 100 && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {module.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {module.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[module.difficulty]}`}>
            {module.difficulty}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {module.specialty.replace('-', ' ')}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{module.estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{module.xpReward} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        {module.completionRate > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs text-gray-500">{module.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${specialtyColors[module.specialty]} transition-all duration-300`}
                style={{ width: `${module.completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onStart(module.id)}
          disabled={module.isLocked}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            module.isLocked
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : module.completionRate === 100
              ? 'bg-green-50 text-green-700 hover:bg-green-100'
              : module.completionRate > 0
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-sm hover:shadow-md'
          }`}
        >
          {module.isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Locked
            </>
          ) : module.completionRate === 100 ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Review
            </>
          ) : module.completionRate > 0 ? (
            <>
              <Play className="w-4 h-4" />
              Continue
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Learning
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;