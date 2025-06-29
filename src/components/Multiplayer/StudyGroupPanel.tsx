import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, MessageCircle, Video, Crown, UserPlus, Settings, Trophy } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { StudyGroup, User } from '../../types';

const StudyGroupPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  // Mock study groups and online users
  const availableGroups: StudyGroup[] = [
    {
      id: 'group-1',
      name: 'Endodontics Study Circle',
      members: [
        { id: '1', name: 'Sarah Chen', level: 12, xp: 2450, totalPoints: 3200, badges: [], currentStreak: 5, studyTime: 45, globalRank: 1 },
        { id: '2', name: 'Michael Rodriguez', level: 11, xp: 2280, totalPoints: 2950, badges: [], currentStreak: 3, studyTime: 38, globalRank: 2 },
        { id: '3', name: 'Emily Zhang', level: 10, xp: 2100, totalPoints: 2800, badges: [], currentStreak: 7, studyTime: 42, globalRank: 3 }
      ],
      currentModule: 'Root Canal Therapy Advanced',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'group-2',
      name: 'Prosthodontics Masters',
      members: [
        { id: '4', name: 'James Wilson', level: 10, xp: 2050, totalPoints: 2650, badges: [], currentStreak: 4, studyTime: 35, globalRank: 4 },
        { id: '5', name: 'Anna Petrov', level: 9, xp: 1950, totalPoints: 2500, badges: [], currentStreak: 6, studyTime: 40, globalRank: 5 }
      ],
      currentModule: 'Crown and Bridge Preparation',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'group-3',
      name: 'Periodontics Research Group',
      members: [
        { id: '6', name: 'David Kim', level: 9, xp: 1890, totalPoints: 2350, badges: [], currentStreak: 2, studyTime: 30, globalRank: 6 },
        { id: '7', name: 'Lisa Thompson', level: 8, xp: 1750, totalPoints: 2200, badges: [], currentStreak: 8, studyTime: 50, globalRank: 7 }
      ],
      currentModule: null,
      isActive: false,
      createdAt: new Date()
    }
  ];

  const onlineUsers: User[] = [
    { id: '8', name: 'Carlos Garcia', level: 8, xp: 1650, totalPoints: 2050, badges: [], currentStreak: 3, studyTime: 25, globalRank: 8 },
    { id: '9', name: 'Rachel Adams', level: 7, xp: 1550, totalPoints: 1900, badges: [], currentStreak: 5, studyTime: 33, globalRank: 9 },
    { id: '10', name: 'Alex Johnson', level: 7, xp: 1450, totalPoints: 1750, badges: [], currentStreak: 1, studyTime: 28, globalRank: 10 }
  ];

  const createStudyGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      members: [state.user],
      currentModule: null,
      isActive: false,
      createdAt: new Date()
    };

    dispatch({ type: 'JOIN_STUDY_GROUP', payload: newGroup });
    setNewGroupName('');
    setShowCreateGroup(false);
    dispatch({ type: 'EARN_XP', payload: 10 });
  };

  const joinGroup = (group: StudyGroup) => {
    const updatedGroup = {
      ...group,
      members: [...group.members, state.user]
    };
    dispatch({ type: 'JOIN_STUDY_GROUP', payload: updatedGroup });
    dispatch({ type: 'EARN_XP', payload: 15 });
  };

  const startMultiplayerSession = (group: StudyGroup) => {
    dispatch({ 
      type: 'START_MULTIPLAYER', 
      payload: { 
        roomId: `room-${group.id}`, 
        participants: group.members 
      } 
    });
    dispatch({ type: 'EARN_XP', payload: 20 });
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups & Multiplayer</h1>
            <p className="text-gray-600">Collaborate with fellow dental students in real-time learning sessions</p>
          </div>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Group</span>
          </button>
        </div>

        {/* Active Multiplayer Session */}
        {state.multiplayer.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎮 Active Multiplayer Session</h3>
                <p className="text-green-100">Room ID: {state.multiplayer.roomId}</p>
                <p className="text-green-100">{state.multiplayer.participants.length} participants online</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {state.multiplayer.participants.slice(0, 4).map((participant, index) => (
                    <div
                      key={participant.id}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white text-sm font-bold"
                    >
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => dispatch({ type: 'END_MULTIPLAYER' })}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Leave Session
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Groups */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Available Study Groups
            </h2>

            <div className="space-y-4">
              {availableGroups.map((group) => (
                <motion.div
                  key={group.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{group.members.length} members</span>
                        <span className={`flex items-center ${group.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${group.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {group.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!state.studyGroups.some(sg => sg.id === group.id) && (
                        <button
                          onClick={() => joinGroup(group)}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          Join Group
                        </button>
                      )}
                      {group.isActive && (
                        <button
                          onClick={() => startMultiplayerSession(group)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-sm font-medium flex items-center space-x-1"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Session</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {group.currentModule && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Crown className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-900">
                          Currently studying: {group.currentModule}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 5).map((member, index) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white text-white text-xs font-bold"
                          title={member.name}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {group.members.length > 5 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white text-gray-600 text-xs font-bold">
                          +{group.members.length - 5}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>Chat</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>Leaderboard</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Online Users */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Online Users</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Level {user.level} • #{user.globalRank}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  🎯 Start Quiz Battle
                </button>
                <button className="w-full p-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                  🏆 Join Tournament
                </button>
                <button className="w-full p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  📚 Study Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowCreateGroup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Create Study Group</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Enter group name..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowCreateGroup(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createStudyGroup}
                      disabled={!newGroupName.trim()}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudyGroupPanel;