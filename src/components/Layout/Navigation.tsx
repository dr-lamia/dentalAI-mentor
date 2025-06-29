import React from 'react';
import { Home, BookOpen, Users, Trophy, User, Smartphone, Beaker, Stethoscope, Microscope, GraduationCap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSceneSelect?: (scene: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onSceneSelect }) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'modules', label: 'Learning Modules', icon: BookOpen },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'community', label: 'Study Groups', icon: Users },
    { id: 'arvr', label: 'AR/VR Learning', icon: Smartphone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const sceneItems = [
    { id: 'dental-office', label: 'Dental Office', icon: Stethoscope, description: '3D Tooth Preparation' },
    { id: 'lecture-room', label: 'Lecture Room', icon: GraduationCap, description: 'AI-Powered Q&A' },
    { id: 'diagnosis-treatment', label: 'Diagnosis Center', icon: Microscope, description: 'Case Studies & X-rays' },
    { id: 'laboratory', label: 'Dental Lab', icon: Beaker, description: 'Material Selection & CAD/CAM' },
  ];

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Main Menu</h3>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Interactive Scenes */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Interactive Scenes</h3>
          <ul className="space-y-2">
            {sceneItems.map((scene) => {
              const Icon = scene.icon;
              
              return (
                <li key={scene.id}>
                  <button
                    onClick={() => onSceneSelect?.(scene.id)}
                    className="w-full flex items-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 group"
                  >
                    <Icon className="w-5 h-5 mt-0.5 group-hover:text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">{scene.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-purple-500">{scene.description}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-2">Today's Progress</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">XP Earned</span>
              <span className="font-semibold text-blue-600">+125</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Study Time</span>
              <span className="font-semibold text-purple-600">2h 15m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Streak</span>
              <span className="font-semibold text-green-600">7 days</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;