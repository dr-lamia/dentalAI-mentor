import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, MessageCircle, Video, Crown, UserPlus, Settings, Trophy, X, Send, Clock } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { StudyGroup, User } from '../../types';

const StudyGroupPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  // Mock study groups
  const [availableGroups, setAvailableGroups] = useState<StudyGroup[]>([
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
  ]);

  // Initialize online users
  useEffect(() => {
    // Simulate fetching online users
    const mockOnlineUsers: User[] = [
      { id: '8', name: 'Carlos Garcia', level: 8, xp: 1650, totalPoints: 2050, badges: [], currentStreak: 3, studyTime: 25, globalRank: 8 },
      { id: '9', name: 'Rachel Adams', level: 7, xp: 1550, totalPoints: 1900, badges: [], currentStreak: 5, studyTime: 33, globalRank: 9 },
      { id: '10', name: 'Alex Johnson', level: 7, xp: 1450, totalPoints: 1750, badges: [], currentStreak: 1, studyTime: 28, globalRank: 10 }
    ];
    setOnlineUsers(mockOnlineUsers);

    // Simulate periodic updates of online users
    const interval = setInterval(() => {
      // Randomly add or remove users to simulate real-time changes
      if (Math.random() > 0.7) {
        const newUser = {
          id: `user-${Date.now()}`,
          name: `New User ${Math.floor(Math.random() * 100)}`,
          level: Math.floor(Math.random() * 10) + 1,
          xp: Math.floor(Math.random() * 2000) + 500,
          totalPoints: Math.floor(Math.random() * 3000) + 1000,
          badges: [],
          currentStreak: Math.floor(Math.random() * 10),
          studyTime: Math.floor(Math.random() * 50) + 10,
          globalRank: Math.floor(Math.random() * 100) + 10
        };
        setOnlineUsers(prev => [...prev, newUser]);
      } else if (onlineUsers.length > 3 && Math.random() > 0.7) {
        setOnlineUsers(prev => prev.slice(0, prev.length - 1));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const createStudyGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      members: [state.user],
      currentModule: null,
      isActive: true,
      createdAt: new Date()
    };

    setAvailableGroups(prev => [...prev, newGroup]);
    dispatch({ type: 'JOIN_STUDY_GROUP', payload: newGroup });
    setNewGroupName('');
    setShowCreateGroup(false);
    dispatch({ type: 'EARN_XP', payload: 10 });
  };

  const joinGroup = (group: StudyGroup) => {
    // Check if user is already a member
    if (group.members.some(m => m.id === state.user.id)) {
      setSelectedGroup(group);
      return;
    }

    const updatedGroup = {
      ...group,
      members: [...group.members, state.user]
    };

    setAvailableGroups(prev => 
      prev.map(g => g.id === group.id ? updatedGroup : g)
    );
    
    dispatch({ type: 'JOIN_STUDY_GROUP', payload: updatedGroup });
    dispatch({ type: 'EARN_XP', payload: 15 });
    setSelectedGroup(updatedGroup);
  };

  const leaveGroup = (groupId: string) => {
    setAvailableGroups(prev => 
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter(m => m.id !== state.user.id)
          };
        }
        return g;
      })
    );
    
    dispatch({ type: 'LEAVE_STUDY_GROUP', payload: groupId });
    setSelectedGroup(null);
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

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !selectedGroup) return;

    const newMessage = {
      id: Date.now().toString(),
      userId: state.user.id,
      userName: state.user.name,
      message: chatMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate receiving messages from other users
    setTimeout(() => {
      if (Math.random() > 0.7 && selectedGroup) {
        const randomMember = selectedGroup.members.find(m => m.id !== state.user.id);
        if (randomMember) {
          const responseMessage = {
            id: (Date.now() + 1).toString(),
            userId: randomMember.id,
            userName: randomMember.name,
            message: getRandomResponse(chatMessage),
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, responseMessage]);
        }
      }
    }, Math.random() * 5000 + 1000);
  };

  const getRandomResponse = (message: string) => {
    const responses = [
      "That's a great point! I agree with your perspective.",
      "Interesting thought. Have you considered looking at the latest research on this topic?",
      "I had a similar case in my clinical rotation. The approach we took was different though.",
      "Thanks for sharing! This helps me understand the concept better.",
      "I'm not sure I follow. Could you elaborate a bit more?",
      "That's exactly what we covered in last week's lecture!",
      "Have you tried using that technique in practice? How did it work out?",
      "I found a great article about this topic. I'll share it with the group later."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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

        {selectedGroup ? (
          // Group Chat View
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-250px)] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedGroup.name}</h2>
                    <p className="text-sm text-blue-100">{selectedGroup.members.length} members • {selectedGroup.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => startMultiplayerSession(selectedGroup)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-1"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Session</span>
                  </button>
                  <button 
                    onClick={() => setSelectedGroup(null)}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600 mb-4">Start the conversation with your study group</p>
                  <div className="flex justify-center space-x-2">
                    <button 
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      onClick={() => setChatMessage("Hi everyone! What topic should we focus on today?")}
                    >
                      Say hello
                    </button>
                    <button 
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      onClick={() => setChatMessage("I'm having trouble with a concept. Can someone help explain it?")}
                    >
                      Ask for help
                    </button>
                  </div>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.userId === state.user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.userId === state.user.id ? 'order-2' : 'order-1'}`}>
                      {msg.userId !== state.user.id && (
                        <p className="text-xs text-gray-500 mb-1 ml-2">{msg.userName}</p>
                      )}
                      <div className={`p-3 rounded-lg ${
                        msg.userId === state.user.id 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        <p className="mb-1">{msg.message}</p>
                        <p className={`text-xs ${
                          msg.userId === state.user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    {msg.userId === state.user.id ? (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 order-1">
                        {state.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 order-2">
                        {msg.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatMessage.trim()) {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatMessage.trim()}
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Group Members Sidebar */}
            <div className="absolute right-8 top-[250px] w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Group Members</h3>
              </div>
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {selectedGroup.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">Level {member.level}</p>
                      </div>
                    </div>
                    {member.id !== state.user.id && (
                      <button className="text-gray-400 hover:text-blue-500">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button 
                  onClick={() => leaveGroup(selectedGroup.id)}
                  className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        ) : (
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
                        {!group.members.some(m => m.id === state.user.id) ? (
                          <button
                            onClick={() => joinGroup(group)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            Join Group
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedGroup(group)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Open Chat
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
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          // Create a direct message group
                          const dmGroup: StudyGroup = {
                            id: `dm-${Date.now()}`,
                            name: `Chat with ${user.name}`,
                            members: [state.user, user],
                            currentModule: null,
                            isActive: true,
                            createdAt: new Date()
                          };
                          setAvailableGroups(prev => [...prev, dmGroup]);
                          setSelectedGroup(dmGroup);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    className="w-full p-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    onClick={() => {
                      // Create a quiz battle group
                      const quizGroup: StudyGroup = {
                        id: `quiz-battle-${Date.now()}`,
                        name: 'Quiz Battle Group',
                        members: [state.user],
                        currentModule: 'Interactive Quiz Competition',
                        isActive: true,
                        createdAt: new Date()
                      };
                      setAvailableGroups(prev => [...prev, quizGroup]);
                      setSelectedGroup(quizGroup);
                    }}
                  >
                    🎯 Start Quiz Battle
                  </button>
                  <button 
                    className="w-full p-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                    onClick={() => {
                      // Create a tournament group
                      const tournamentGroup: StudyGroup = {
                        id: `tournament-${Date.now()}`,
                        name: 'Dental Knowledge Tournament',
                        members: [state.user],
                        currentModule: 'Tournament Mode',
                        isActive: true,
                        createdAt: new Date()
                      };
                      setAvailableGroups(prev => [...prev, tournamentGroup]);
                      setSelectedGroup(tournamentGroup);
                    }}
                  >
                    🏆 Join Tournament
                  </button>
                  <button 
                    className="w-full p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    onClick={() => {
                      // Create a study session group
                      const studyGroup: StudyGroup = {
                        id: `study-session-${Date.now()}`,
                        name: 'Focused Study Session',
                        members: [state.user],
                        currentModule: 'Collaborative Learning',
                        isActive: true,
                        createdAt: new Date()
                      };
                      setAvailableGroups(prev => [...prev, studyGroup]);
                      setSelectedGroup(studyGroup);
                    }}
                  >
                    📚 Study Session
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">Endodontics Workshop</h4>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Today</span>
                    </div>
                    <div className="flex items-center text-xs text-blue-700">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>8:00 PM - 9:30 PM</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-900">Case Study Review</h4>
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Tomorrow</span>
                    </div>
                    <div className="flex items-center text-xs text-purple-700">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>6:30 PM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty Focus
                    </label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="general">General Dentistry</option>
                      <option value="endodontics">Endodontics</option>
                      <option value="prosthodontics">Prosthodontics</option>
                      <option value="periodontics">Periodontics</option>
                      <option value="orthodontics">Orthodontics</option>
                      <option value="oral-surgery">Oral Surgery</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Settings
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input type="radio" name="privacy" value="public" className="mr-2" defaultChecked />
                        <span>Public</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="privacy" value="private" className="mr-2" />
                        <span>Private</span>
                      </label>
                    </div>
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