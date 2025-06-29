import React, { useState } from 'react';
import { Smartphone, Headphones, Eye, Settings, Play } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const AIEnhancedARVR: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedMode, setSelectedMode] = useState<'AR' | 'VR' | null>(null);

  // Tie AR/VR toggles to existing Scene Loader controls
  const handleModeSelect = (mode: 'AR' | 'VR') => {
    setSelectedMode(mode);
    
    // Trigger the correct scene names
    if (mode === 'AR') {
      dispatch({ type: 'SET_SCENE', payload: 'dental-office' }); // ARScene equivalent
    } else {
      dispatch({ type: 'SET_SCENE', payload: 'laboratory' }); // VRScene equivalent
    }
    
    dispatch({ type: 'TOGGLE_ARVR', payload: true });
  };

  const startSession = (featureId: string) => {
    // Award XP for starting AR/VR session
    dispatch({ type: 'EARN_XP', payload: 25 });
    
    // Set the appropriate scene based on feature
    if (selectedMode === 'AR') {
      dispatch({ type: 'SET_SCENE', payload: 'dental-office' });
    } else {
      dispatch({ type: 'SET_SCENE', payload: 'laboratory' });
    }
  };

  const arFeatures = [
    {
      id: 'tooth-anatomy',
      title: '3D Tooth Anatomy',
      description: 'Explore detailed tooth structures in augmented reality',
      icon: '🦷',
      difficulty: 'Beginner',
      duration: '15 min'
    },
    {
      id: 'procedure-guide',
      title: 'Procedure Overlay',
      description: 'Step-by-step procedure guidance with AR annotations',
      icon: '📋',
      difficulty: 'Intermediate',
      duration: '30 min'
    }
  ];

  const vrFeatures = [
    {
      id: 'virtual-clinic',
      title: 'Virtual Dental Clinic',
      description: 'Immersive dental office environment for practice',
      icon: '🏥',
      difficulty: 'Beginner',
      duration: '20 min'
    },
    {
      id: 'surgery-simulation',
      title: 'Surgery Simulation',
      description: 'Practice complex procedures in safe VR environment',
      icon: '🔬',
      difficulty: 'Advanced',
      duration: '60 min'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AR/VR Learning Experience</h1>
        <p className="text-gray-600 text-lg">Immersive dental education using cutting-edge technology</p>
      </div>

      {/* Mode Selection */}
      {!selectedMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AR Mode */}
          <div
            onClick={() => handleModeSelect('AR')}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Augmented Reality</h3>
              <p className="text-gray-600 mb-6">
                Overlay digital dental content onto the real world using your mobile device.
              </p>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Enter AR Mode
              </button>
            </div>
          </div>

          {/* VR Mode */}
          <div
            onClick={() => handleModeSelect('VR')}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Virtual Reality</h3>
              <p className="text-gray-600 mb-6">
                Immerse yourself in fully virtual dental environments for safe practice.
              </p>
              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Enter VR Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Selection */}
      {selectedMode && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedMode} Learning Modules
            </h2>
            <button
              onClick={() => setSelectedMode(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Mode Selection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(selectedMode === 'AR' ? arFeatures : vrFeatures).map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      feature.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      feature.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {feature.difficulty}
                    </span>
                    <span className="text-gray-500">{feature.duration}</span>
                  </div>

                  <button
                    onClick={() => startSession(feature.id)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start {selectedMode} Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIEnhancedARVR;