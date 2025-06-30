import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Video, Clock } from 'lucide-react';
import { StudyGroup } from '../../types';

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoin: (group: StudyGroup) => void;
  onChat: (group: StudyGroup) => void;
  onSession: (group: StudyGroup) => void;
  isMember: boolean;
}

const StudyGroupCard: React.FC<StudyGroupCardProps> = ({ 
  group, 
  onJoin, 
  onChat, 
  onSession, 
  isMember 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden"
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
          {!isMember ? (
            <button
              onClick={() => onJoin(group)}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Join Group
            </button>
          ) : (
            <button
              onClick={() => onChat(group)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Open Chat
            </button>
          )}
          {group.isActive && (
            <button
              onClick={() => onSession(group)}
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
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
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
            <Users className="w-4 h-4 mr-1" />
            <span>Members</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyGroupCard;