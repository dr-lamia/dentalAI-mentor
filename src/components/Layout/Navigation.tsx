import React, { useState } from 'react';
import { Home, BookOpen, Users, Trophy, User, Smartphone, Beaker, Stethoscope, Microscope, GraduationCap, Menu, X, MessageCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSceneSelect?: (scene: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onSceneSelect }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'modules', label: 'Learning Modules', icon: BookOpen },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'community', label: 'Study Groups', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'arvr', label: 'AR/VR Learning', icon: Smartphone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const sceneItems = [
    { id: 'dental-office', label: 'Dental Office', icon: Stethoscope, description: '3D Tooth Preparation' },
    { id: 'lecture-room', label: 'Lecture Room', icon: GraduationCap, description: 'AI-Powered Q&A' },
    { id: 'diagnosis-treatment', label: 'Diagnosis Center', icon: Microscope, description: 'Case Studies & X-rays' },
    { id: 'laboratory', label: 'Dental Lab', icon: Beaker, description: 'Material Selection & CAD/CAM' },
  ];

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId);
    setIsMobileMenuOpen(false);
  };

  const handleSceneClick = (sceneId: string) => {
    onSceneSelect?.(sceneId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-sm border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        min-h-screen overflow-y-auto
      `}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Mobile Header Spacer */}
          <div className="lg:hidden h-12"></div>

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
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.label}</span>
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
                      onClick={() => handleSceneClick(scene.id)}
                      className="w-full flex items-start space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 group text-left"
                    >
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5 mt-0.5 group-hover:text-purple-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm lg:text-base truncate">{scene.label}</div>
                        <div className="text-xs text-gray-500 group-hover:text-purple-500 line-clamp-2">{scene.description}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 lg:p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Today's Progress</h4>
            <div className="space-y-2 text-xs lg:text-sm">
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
    </>
  );
};

export default Navigation;