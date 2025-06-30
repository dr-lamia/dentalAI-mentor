import React, { useState } from 'react';
import { BookOpen, Trophy, Clock, TrendingUp, Star, Award, Users, Target, MessageCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import { useGame } from '../../contexts/GameContext';
import ChatInterface from '../Multiplayer/ChatInterface';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { user } = state;
  const [showChat, setShowChat] = useState(false);
  const [activeChatGroup, setActiveChatGroup] = useState<{id: string, name: string} | null>(null);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Ready to advance your dental expertise today?</p>
            <div className="flex flex-wrap items-center mt-3 sm:mt-4 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                <span className="font-semibold text-sm sm:text-base">Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                <span className="font-semibold text-sm sm:text-base">{user.badges.length} Badges</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block flex-shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { action: 'Completed Endodontics Module', time: '2 hours ago', xp: 50, image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { action: 'Earned "Precision Star" Badge', time: '1 day ago', xp: 25, image: 'https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { action: 'Finished Root Canal Quiz', time: '2 days ago', xp: 30, image: 'https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { action: 'Started Prosthodontics Course', time: '3 days ago', xp: 0, image: 'https://images.pexels.com/photos/3845769/pexels-photo-3845769.jpeg?auto=compress&cs=tinysrgb&w=100' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {activity.image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={activity.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{activity.action}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.xp > 0 && (
                  <div className="text-green-600 font-semibold text-sm sm:text-base ml-2">+{activity.xp} XP</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Study Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Study Progress</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { specialty: 'Endodontics', progress: 85, color: 'bg-blue-500', image: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { specialty: 'Periodontics', progress: 62, color: 'bg-green-500', image: 'https://images.pexels.com/photos/3779693/pexels-photo-3779693.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { specialty: 'Prosthodontics', progress: 45, color: 'bg-purple-500', image: 'https://images.pexels.com/photos/3779698/pexels-photo-3779698.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { specialty: 'Orthodontics', progress: 30, color: 'bg-orange-500', image: 'https://images.pexels.com/photos/3779714/pexels-photo-3779714.jpeg?auto=compress&cs=tinysrgb&w=100' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                {item.image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button
            className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left w-full"
            onClick={() => {
              // Navigate to quiz section
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Take a Quiz</h4>
              <p className="text-xs sm:text-sm text-gray-500">Test your knowledge</p>
            </div>
          </button>
          
          <button
            className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left w-full"
            onClick={() => {
              // Open chat with study group
              setActiveChatGroup({
                id: 'study-group-1',
                name: 'Dental Study Group'
              });
              setShowChat(true);
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Join Study Group</h4>
              <p className="text-xs sm:text-sm text-gray-500">Learn with peers</p>
            </div>
          </button>
          
          <button
            className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left w-full"
            onClick={() => {
              // Navigate to continue learning
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Continue Learning</h4>
              <p className="text-xs sm:text-sm text-gray-500">Resume last module</p>
            </div>
          </button>
        </div>
      </div>

      {/* Study Groups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Study Groups</h3>
          <button 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => {
              // Navigate to study groups page
            }}
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.studyGroups.length > 0 ? (
            state.studyGroups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{group.name}</h4>
                  <span className={`flex items-center text-xs ${group.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${group.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {group.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{group.members.length} members</p>
                <div className="flex -space-x-2 mb-4">
                  {group.members.slice(0, 3).map((member) => (
                    <div 
                      key={member.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">
                      +{group.members.length - 3}
                    </div>
                  )}
                </div>
                <button 
                  className="w-full py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center space-x-1"
                  onClick={() => {
                    setActiveChatGroup({
                      id: group.id,
                      name: group.name
                    });
                    setShowChat(true);
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Chat</span>
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-2">No Study Groups Yet</h4>
              <p className="text-gray-500 text-sm mb-4">Join or create a study group to collaborate with peers</p>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  // Navigate to study groups page
                }}
              >
                Find Study Groups
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Learning Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Featured Learning Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Advanced Endodontics",
              description: "Master complex root canal procedures",
              image: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
              category: "Course"
            },
            {
              title: "Dental Implant Techniques",
              description: "Latest approaches in implantology",
              image: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=600",
              category: "Workshop"
            },
            {
              title: "Esthetic Dentistry",
              description: "Creating beautiful, natural smiles",
              image: "https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=600",
              category: "Webinar"
            },
            {
              title: "Periodontal Surgery",
              description: "Surgical techniques for gum disease",
              image: "https://images.pexels.com/photos/3845769/pexels-photo-3845769.jpeg?auto=compress&cs=tinysrgb&w=600",
              category: "Masterclass"
            }
          ].map((resource, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl">
              <img 
                src={resource.image} 
                alt={resource.title} 
                className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-xs font-medium text-blue-300 mb-1">{resource.category}</span>
                <h4 className="text-white font-semibold mb-1">{resource.title}</h4>
                <p className="text-white/80 text-xs">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Live Webinar: Digital Dentistry",
              date: "June 15, 2025",
              time: "2:00 PM - 4:00 PM",
              image: "https://images.pexels.com/photos/3845769/pexels-photo-3845769.jpeg?auto=compress&cs=tinysrgb&w=600",
              attendees: 42
            },
            {
              title: "Case Study Discussion: Complex Restorations",
              date: "June 18, 2025",
              time: "6:30 PM - 8:00 PM",
              image: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=600",
              attendees: 28
            },
            {
              title: "Hands-on Workshop: Dental Photography",
              date: "June 22, 2025",
              time: "9:00 AM - 12:00 PM",
              image: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
              attendees: 15
            }
          ].map((event, index) => (
            <div key={index} className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-32 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-gray-500">{event.attendees} attending</span>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Register</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface Modal */}
      {showChat && activeChatGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl h-[80vh]">
            <ChatInterface 
              groupId={activeChatGroup.id} 
              groupName={activeChatGroup.name} 
              onClose={() => {
                setShowChat(false);
                setActiveChatGroup(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;