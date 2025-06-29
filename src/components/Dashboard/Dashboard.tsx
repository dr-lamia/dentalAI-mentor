import React from 'react';
import { BookOpen, Trophy, Clock, TrendingUp, Star, Award, Users, Target } from 'lucide-react';
import StatsCard from './StatsCard';
import { useGame } from '../../contexts/GameContext';

const Dashboard: React.FC = () => {
  const { state } = useGame();
  const { user } = state;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-blue-100 text-lg">Ready to advance your dental expertise today?</p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">{user.badges.length} Badges</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-16 h-16 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total XP"
          value={user.xp}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Modules Completed"
          value={8}
          icon={BookOpen}
          trend={{ value: 25, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Study Time"
          value="24h"
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
          color="purple"
        />
        <StatsCard
          title="Global Rank"
          value="#47"
          icon={Trophy}
          trend={{ value: 3, isPositive: true }}
          color="orange"
        />
      </div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Completed Endodontics Module', time: '2 hours ago', xp: 50 },
              { action: 'Earned "Precision Star" Badge', time: '1 day ago', xp: 25 },
              { action: 'Finished Root Canal Quiz', time: '2 days ago', xp: 30 },
              { action: 'Started Prosthodontics Course', time: '3 days ago', xp: 0 },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.xp > 0 && (
                  <div className="text-green-600 font-semibold">+{activity.xp} XP</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Study Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Progress</h3>
          <div className="space-y-4">
            {[
              { specialty: 'Endodontics', progress: 85, color: 'bg-blue-500' },
              { specialty: 'Periodontics', progress: 62, color: 'bg-green-500' },
              { specialty: 'Prosthodontics', progress: 45, color: 'bg-purple-500' },
              { specialty: 'Orthodontics', progress: 30, color: 'bg-orange-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.specialty}</span>
                  <span className="text-sm text-gray-500">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Take a Quiz', description: 'Test your knowledge', icon: Target, color: 'bg-blue-500' },
            { title: 'Join Study Group', description: 'Learn with peers', icon: Users, color: 'bg-green-500' },
            { title: 'Continue Learning', description: 'Resume last module', icon: BookOpen, color: 'bg-purple-500' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;