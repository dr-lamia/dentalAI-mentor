import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Headphones, Eye, Settings, Play, Pause, RotateCcw, Maximize } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const ARVRInterface: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedMode, setSelectedMode] = useState<'AR' | 'VR' | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState<'tooth-anatomy' | 'procedure-guide' | 'virtual-patient'>('tooth-anatomy');

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
    },
    {
      id: 'virtual-patient',
      title: 'Virtual Patient',
      description: 'Practice on virtual patients with realistic scenarios',
      icon: '👤',
      difficulty: 'Advanced',
      duration: '45 min'
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
    },
    {
      id: 'collaborative-learning',
      title: 'Collaborative Learning',
      description: 'Learn with other students in shared VR space',
      icon: '👥',
      difficulty: 'Intermediate',
      duration: '40 min'
    }
  ];

  const startARSession = (featureId: string) => {
    setSessionType(featureId as any);
    setIsSessionActive(true);
    dispatch({ type: 'TOGGLE_ARVR', payload: true });
    dispatch({ type: 'EARN_XP', payload: 25 });
  };

  const startVRSession = (featureId: string) => {
    setSessionType(featureId as any);
    setIsSessionActive(true);
    dispatch({ type: 'TOGGLE_ARVR', payload: true });
    dispatch({ type: 'EARN_XP', payload: 30 });
  };

  const endSession = () => {
    setIsSessionActive(false);
    dispatch({ type: 'TOGGLE_ARVR', payload: false });
    setSelectedMode(null);
  };

  if (isSessionActive) {
    return (
      <div className="h-full bg-black text-white flex flex-col">
        {/* AR/VR Session Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {selectedMode === 'AR' ? <Smartphone className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedMode} Session Active</h2>
                <p className="text-purple-100 capitalize">{sessionType.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={endSession}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* AR/VR Content Area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl mb-6"
            >
              {selectedMode === 'AR' ? '📱' : '🥽'}
            </motion.div>
            
            <h3 className="text-3xl font-bold mb-4">
              {selectedMode} Experience Active
            </h3>
            
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              {selectedMode === 'AR' 
                ? 'Point your device camera at a flat surface to begin the augmented reality experience.'
                : 'Put on your VR headset and use the controllers to interact with the virtual environment.'
              }
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Session Time</h4>
                <p className="text-2xl font-bold text-blue-400">12:34</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">XP Earned</h4>
                <p className="text-2xl font-bold text-green-400">+45</p>
              </div>
            </div>

            {/* Session Controls */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Play className="w-6 h-6" />
              </button>
              <button className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Pause className="w-6 h-6" />
              </button>
              <button className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <RotateCcw className="w-6 h-6" />
              </button>
              <button className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Session Instructions */}
        <div className="p-6 bg-gray-900 border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            <h4 className="font-semibold mb-3">Session Instructions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">1.</span>
                <span>Position yourself in a well-lit area with adequate space</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">2.</span>
                <span>Follow the on-screen prompts and interact with 3D objects</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">3.</span>
                <span>Complete the learning objectives to earn maximum XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AR/VR Learning Experience</h1>
          <p className="text-gray-600 text-lg">Immersive dental education using cutting-edge technology</p>
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AR Mode */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMode('AR')}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Augmented Reality</h3>
                <p className="text-gray-600 mb-6">
                  Overlay digital dental content onto the real world using your mobile device or AR glasses.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>Mobile AR Support</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Settings className="w-4 h-4" />
                    <span>Real-world Integration</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* VR Mode */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMode('VR')}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Virtual Reality</h3>
                <p className="text-gray-600 mb-6">
                  Immerse yourself in fully virtual dental environments for safe practice and learning.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>Full Immersion</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Settings className="w-4 h-4" />
                    <span>Hand Tracking</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Feature Selection */}
        <AnimatePresence>
          {selectedMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(selectedMode === 'AR' ? arFeatures : vrFeatures).map((feature) => (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
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
                        onClick={() => selectedMode === 'AR' ? startARSession(feature.id) : startVRSession(feature.id)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start {selectedMode} Session</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* System Requirements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedMode === 'AR' ? 'AR Requirements' : 'VR Requirements'}
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedMode === 'AR' ? (
                        <>
                          <li>• iOS 12+ or Android 7.0+</li>
                          <li>• ARCore/ARKit support</li>
                          <li>• Rear-facing camera</li>
                          <li>• Gyroscope and accelerometer</li>
                        </>
                      ) : (
                        <>
                          <li>• VR headset (Oculus, HTC Vive, etc.)</li>
                          <li>• Hand tracking controllers</li>
                          <li>• 6DOF tracking support</li>
                          <li>• Minimum 90Hz refresh rate</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Setup</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Well-lit environment</li>
                      <li>• 2m x 2m clear space</li>
                      <li>• Stable internet connection</li>
                      <li>• Headphones for audio</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ARVRInterface;