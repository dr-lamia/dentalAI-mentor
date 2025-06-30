import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { GameProvider } from './contexts/GameContext';
import AuthPage from './components/Auth/AuthPage';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import ModulesGrid from './components/Modules/ModulesGrid';
import Leaderboard from './components/Leaderboard/Leaderboard';
import StudyGroupPanel from './components/Multiplayer/StudyGroupPanel';
import ARVRInterface from './components/ARVR/ARVRInterface';
import DentalOfficeScene from './components/Scenes/DentalOfficeScene';
import LectureRoomScene from './components/Scenes/LectureRoomScene';
import DiagnosisTreatmentScene from './components/Scenes/DiagnosisTreatmentScene';
import LaboratoryScene from './components/Scenes/LaboratoryScene';
import AIAvatar from './components/AI/AIAvatar';
import ChatInterface from './components/Multiplayer/ChatInterface';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [showAIAvatar, setShowAIAvatar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeChatGroup, setActiveChatGroup] = useState<{id: string, name: string} | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-lg sm:text-xl">DM</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Loading DentalMentor...</h2>
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderContent = () => {
    // Scene-based content (interactive modules)
    if (activeScene) {
      switch (activeScene) {
        case 'dental-office':
          return <DentalOfficeScene />;
        case 'lecture-room':
          return <LectureRoomScene />;
        case 'diagnosis-treatment':
          return <DiagnosisTreatmentScene />;
        case 'laboratory':
          return <LaboratoryScene />;
        default:
          return <Dashboard />;
      }
    }

    // Main navigation content
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'modules':
        return <ModulesGrid onSceneSelect={setActiveScene} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'community':
        return <StudyGroupPanel />;
      case 'chat':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chat Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => {
                  setActiveChatGroup({
                    id: 'general-chat',
                    name: 'General Discussion'
                  });
                  setShowChat(true);
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">General Discussion</h3>
                    <p className="text-sm text-gray-500">Open chat for all students</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Join the conversation with fellow dental students from around the world.</p>
                <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Join Chat
                </button>
              </div>
              
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => {
                  setActiveChatGroup({
                    id: 'endodontics-chat',
                    name: 'Endodontics Study Group'
                  });
                  setShowChat(true);
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Endodontics Study Group</h3>
                    <p className="text-sm text-gray-500">12 members active</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Discuss root canal techniques, instruments, and challenging cases.</p>
                <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Join Group
                </button>
              </div>
              
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => {
                  setActiveChatGroup({
                    id: 'prosthodontics-chat',
                    name: 'Prosthodontics Masters'
                  });
                  setShowChat(true);
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prosthodontics Masters</h3>
                    <p className="text-sm text-gray-500">8 members active</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Share knowledge about crown preparations, materials, and digital workflows.</p>
                <button className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Join Group
                </button>
              </div>
            </div>
          </div>
        );
      case 'arvr':
        return <ARVRInterface />;
      case 'profile':
        return (
          <div className="p-4 sm:p-6 text-center">
            <div className="text-4xl sm:text-6xl mb-4">👤</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
            <p className="text-gray-600 text-sm sm:text-base">Manage your account settings, view achievements, and track your learning journey.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header - always visible unless in scene mode */}
        {!activeScene && <Header />}
        
        <div className="flex">
          {/* Navigation - hidden in scene mode */}
          {!activeScene && (
            <Navigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              onSceneSelect={setActiveScene}
            />
          )}
          
          {/* Main Content */}
          <main className={`flex-1 overflow-auto ${activeScene ? 'h-screen' : ''} ${!activeScene ? 'lg:ml-0' : ''}`}>
            {/* Scene Exit Button */}
            {activeScene && (
              <button
                onClick={() => setActiveScene(null)}
                className="fixed top-4 left-4 z-50 px-3 py-2 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg shadow-lg hover:bg-white transition-all duration-200 font-medium text-sm sm:text-base"
              >
                ← Exit Scene
              </button>
            )}
            
            {renderContent()}
          </main>
        </div>

        {/* AI Avatar - always available */}
        <AIAvatar 
          isVisible={showAIAvatar} 
          onToggle={() => setShowAIAvatar(!showAIAvatar)} 
        />

        {/* Chat Modal */}
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
    </GameProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;