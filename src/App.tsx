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

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [showAIAvatar, setShowAIAvatar] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">DM</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading DentalMentor...</h2>
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
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
      case 'arvr':
        return <ARVRInterface />;
      case 'profile':
        return (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
            <p className="text-gray-600">Manage your account settings, view achievements, and track your learning journey.</p>
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
          <main className={`flex-1 overflow-auto ${activeScene ? 'h-screen' : ''}`}>
            {/* Scene Exit Button */}
            {activeScene && (
              <button
                onClick={() => setActiveScene(null)}
                className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg shadow-lg hover:bg-white transition-all duration-200 font-medium"
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