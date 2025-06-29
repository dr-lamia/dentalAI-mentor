import React, { useState } from 'react';
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react';
import { LeaderboardEntry } from '../../types';

const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, user: { id: '1', name: 'Sarah Chen', level: 12, xp: 2450, totalPoints: 3200, badges: [] }, points: 3200 },
    { rank: 2, user: { id: '2', name: 'Michael Rodriguez', level: 11, xp: 2280, totalPoints: 2950, badges: [] }, points: 2950 },
    { rank: 3, user: { id: '3', name: 'Emily Zhang', level: 10, xp: 2100, totalPoints: 2800, badges: [] }, points: 2800 },
    { rank: 4, user: { id: '4', name: 'James Wilson', level: 10, xp: 2050, totalPoints: 2650, badges: [] }, points: 2650 },
    { rank: 5, user: { id: '5', name: 'Anna Petrov', level: 9, xp: 1950, totalPoints: 2500, badges: [] }, points: 2500 },
    { rank: 6, user: { id: '6', name: 'David Kim', level: 9, xp: 1890, totalPoints: 2350, badges: [] }, points: 2350 },
    { rank: 7, user: { id: '7', name: 'Lisa Thompson', level: 8, xp: 1750, totalPoints: 2200, badges: [] }, points: 2200 },
    { rank: 8, user: { id: '8', name: 'Carlos Garcia', level: 8, xp: 1650, totalPoints: 2050, badges: [] }, points: 2050 },
    { rank: 9, user: { id: '9', name: 'Rachel Adams', level: 7, xp: 1550, totalPoints: 1900, badges: [] }, points: 1900 },
    { rank: 10, user: { id: '10', name: 'Alex Johnson', level: 7, xp: 1450, totalPoints: 1750, badges: [] }, points: 1750 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        2: 'bg-gradient-to-r from-gray-300 to-gray-500',
        3: 'bg-gradient-to-r from-amber-400 to-amber-600',
      };
      return colors[rank as keyof typeof colors];
    }
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other dental students</p>
        </div>

        {/* Time Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['weekly', 'monthly', 'all-time'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                timeframe === period
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period === 'all-time' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-center items-end space-x-8 mb-8">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 w-32">
              <p className="font-semibold text-gray-900 truncate">{leaderboardData[1].user.name}</p>
              <p className="text-sm text-gray-500">Level {leaderboardData[1].user.level}</p>
              <p className="text-lg font-bold text-gray-700">{leaderboardData[1].points.toLocaleString()}</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto relative">
              <Crown className="w-8 h-8 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 w-36 border-2 border-yellow-200">
              <p className="font-semibold text-gray-900 truncate">{leaderboardData[0].user.name}</p>
              <p className="text-sm text-yellow-600">Level {leaderboardData[0].user.level}</p>
              <p className="text-xl font-bold text-yellow-700">{leaderboardData[0].points.toLocaleString()}</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 w-32">
              <p className="font-semibold text-gray-900 truncate">{leaderboardData[2].user.name}</p>
              <p className="text-sm text-amber-600">Level {leaderboardData[2].user.level}</p>
              <p className="text-lg font-bold text-amber-700">{leaderboardData[2].points.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Full Rankings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.user.id}
              className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                index < 3 ? 'bg-gradient-to-r from-blue-50/30 to-purple-50/30' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                  {entry.rank <= 3 ? (
                    <span className="text-white font-bold">#{entry.rank}</span>
                  ) : (
                    <span className="text-white font-bold">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {entry.user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* User Info */}
                <div>
                  <h4 className="font-semibold text-gray-900">{entry.user.name}</h4>
                  <p className="text-sm text-gray-500">Level {entry.user.level} • {entry.user.xp.toLocaleString()} XP</p>
                </div>
              </div>

              {/* Points and Trend */}
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{entry.points.toLocaleString()}</p>
                <div className="flex items-center justify-end space-x-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">+{Math.floor(Math.random() * 100 + 50)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Ranking */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">#47</span>
            </div>
            <div>
              <h4 className="font-semibold">Your Current Rank</h4>
              <p className="text-blue-100">Keep learning to climb higher!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">1,450</p>
            <p className="text-blue-100 text-sm">Total Points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;