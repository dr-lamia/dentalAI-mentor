import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { websocketService } from '../../services/websocketService';
import { useGame } from '../../contexts/GameContext';

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  score: number;
  level: number;
  isOnline: boolean;
}

const RealtimeLeaderboard: React.FC = () => {
  const { state } = useGame();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, studentId: '1', name: 'Sarah Chen', score: 3200, level: 12, isOnline: true },
    { rank: 2, studentId: '2', name: 'Michael Rodriguez', score: 2950, level: 11, isOnline: true },
    { rank: 3, studentId: '3', name: 'Emily Zhang', score: 2800, level: 10, isOnline: false },
    { rank: 4, studentId: state.user.id, name: state.user.name, score: state.user.totalPoints, level: state.user.level, isOnline: true },
  ]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  useEffect(() => {
    // Connect to WebSocket for real-time score updates
    websocketService.connect(state.user.id);

    // Subscribe to leaderboard updates
    websocketService.on('leaderboardUpdate', (data: any) => {
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    });

    // Subscribe to score updates
    websocketService.on('scoreUpdate', (data: any) => {
      setLeaderboard(prev => 
        prev.map(entry => 
          entry.studentId === data.studentId 
            ? { ...entry, score: entry.score + data.score }
            : entry
        ).sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }))
      );
    });

    // Connection status updates
    websocketService.on('connected', () => setConnectionStatus('connected'));
    websocketService.on('disconnected', () => setConnectionStatus('disconnected'));

    return () => {
      websocketService.off('leaderboardUpdate');
      websocketService.off('scoreUpdate');
      websocketService.off('connected');
      websocketService.off('disconnected');
    };
  }, [state.user.id]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Leaderboard</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={entry.studentId}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              entry.studentId === state.user.id
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Rank */}
              <div className="w-8 h-8 flex items-center justify-center font-bold text-sm">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {entry.name.split(' ').map(n => n[0]).join('')}
                </div>
                {entry.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* User Info */}
              <div>
                <p className="font-medium text-gray-900 text-sm">{entry.name}</p>
                <p className="text-xs text-gray-500">Level {entry.level}</p>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="font-bold text-gray-900">{entry.score.toLocaleString()}</p>
              <div className="flex items-center text-green-600 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+{Math.floor(Math.random() * 50 + 10)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{leaderboard.filter(e => e.isOnline).length} online</span>
          </div>
          <span>Updates in real-time</span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeLeaderboard;