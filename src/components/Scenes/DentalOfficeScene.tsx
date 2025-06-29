import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, AlertTriangle, RotateCcw, Zap } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import * as THREE from 'three';

// Realistic tooth model with proper anatomy
const RealisticToothModel = ({ 
  position, 
  isSelected, 
  onClick, 
  preparationQuality, 
  currentTool,
  preparationProgress,
  toothType = 'molar'
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = isSelected ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
    }
  });

  const getToothColor = () => {
    if (isSelected && currentTool === 'handpiece') {
      return '#e6f3ff'; // Light blue when being worked on
    }
    switch (preparationQuality) {
      case 'poor': return '#ffebee';
      case 'good': return '#fff8e1';
      case 'excellent': return '#e8f5e8';
      default: return '#faf8f5'; // Natural tooth color
    }
  };

  const getMarginColor = () => {
    switch (preparationQuality) {
      case 'poor': return '#ef4444';
      case 'good': return '#f59e0b';
      case 'excellent': return '#10b981';
      default: return '#8b7355';
    }
  };

  // Create different tooth shapes based on type
  const renderToothGeometry = () => {
    switch(toothType) {
      case 'incisor':
        return (
          <>
            {/* Incisor crown - more flat and blade-like */}
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[1.4, 1.8, 0.8]} />
              <meshStandardMaterial 
                color={getToothColor()} 
                roughness={0.2}
                metalness={0.05}
              />
            </mesh>
            
            {/* Incisal edge */}
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[1.4, 0.2, 0.8]} />
              <meshStandardMaterial 
                color={preparationProgress.occlusalReduction ? '#e3f2fd' : '#f5f5f5'}
                roughness={0.3}
              />
            </mesh>
            
            {/* Single root */}
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.4, 0.2, 2, 12]} />
              <meshStandardMaterial 
                color="#f0e68c" 
                roughness={0.4}
                metalness={0.02}
              />
            </mesh>
          </>
        );
        
      case 'premolar':
        return (
          <>
            {/* Premolar crown - smaller than molar with two cusps */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.8, 0.9, 1.6, 12]} />
              <meshStandardMaterial 
                color={getToothColor()} 
                roughness={0.2}
                metalness={0.05}
              />
            </mesh>
            
            {/* Occlusal surface with two cusps */}
            <group position={[0, 1.7, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.7, 0.7, 0.15, 12]} />
                <meshStandardMaterial 
                  color={preparationProgress.occlusalReduction ? '#e3f2fd' : '#faf8f5'}
                  roughness={0.3}
                />
              </mesh>
              
              {/* Buccal cusp */}
              <mesh position={[0, 0.1, 0.3]}>
                <sphereGeometry args={[0.25, 8, 6]} />
                <meshStandardMaterial 
                  color={getToothColor()}
                  roughness={0.25}
                />
              </mesh>
              
              {/* Lingual cusp */}
              <mesh position={[0, 0.1, -0.3]}>
                <sphereGeometry args={[0.25, 8, 6]} />
                <meshStandardMaterial 
                  color={getToothColor()}
                  roughness={0.25}
                />
              </mesh>
            </group>
            
            {/* Two roots */}
            <group position={[0, -0.5, 0]}>
              <mesh position={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.3, 0.15, 1.8, 12]} />
                <meshStandardMaterial 
                  color="#f0e68c" 
                  roughness={0.4}
                  metalness={0.02}
                />
              </mesh>
              
              <mesh position={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.3, 0.15, 1.8, 12]} />
                <meshStandardMaterial 
                  color="#f0e68c" 
                  roughness={0.4}
                  metalness={0.02}
                />
              </mesh>
            </group>
          </>
        );
        
      case 'molar':
      default:
        return (
          <>
            {/* Molar crown - larger with multiple cusps */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.9, 1.1, 1.8, 12]} />
              <meshStandardMaterial 
                color={getToothColor()} 
                roughness={0.2}
                metalness={0.05}
              />
            </mesh>
            
            {/* Occlusal surface with cusps */}
            <group position={[0, 1.8, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.15, 12]} />
                <meshStandardMaterial 
                  color={preparationProgress.occlusalReduction ? '#e3f2fd' : '#faf8f5'}
                  roughness={0.3}
                />
              </mesh>
              
              {/* Mesial cusp */}
              <mesh position={[0.3, 0.1, 0.2]}>
                <sphereGeometry args={[0.25, 8, 6]} />
                <meshStandardMaterial 
                  color={getToothColor()}
                  roughness={0.25}
                />
              </mesh>
              
              {/* Distal cusp */}
              <mesh position={[-0.3, 0.08, 0.15]}>
                <sphereGeometry args={[0.22, 8, 6]} />
                <meshStandardMaterial 
                  color={getToothColor()}
                  roughness={0.25}
                />
              </mesh>
              
              {/* Buccal cusp */}
              <mesh position={[0.1, 0.05, 0.4]}>
                <sphereGeometry args={[0.2, 8, 6]} />
                <meshStandardMaterial 
                  color={getToothColor()}
                  roughness={0.25}
                />
              </mesh>
              
              {/* Lingual cusp */}
              <mesh position={[-0.1, 0.03, -0.35]}>
                <sphereGeometry args={[0.18, 8, 6]} />
                <meshStandardMaterial 
                  color={getToothColor()}
                  roughness={0.25}
                />
              </mesh>
            </group>
            
            {/* Multiple roots */}
            <group position={[0, -0.5, 0]}>
              <mesh position={[0.3, 0, 0.3]}>
                <cylinderGeometry args={[0.3, 0.15, 1.8, 12]} />
                <meshStandardMaterial 
                  color="#f0e68c" 
                  roughness={0.4}
                  metalness={0.02}
                />
              </mesh>
              
              <mesh position={[-0.3, 0, 0.3]}>
                <cylinderGeometry args={[0.3, 0.15, 1.8, 12]} />
                <meshStandardMaterial 
                  color="#f0e68c" 
                  roughness={0.4}
                  metalness={0.02}
                />
              </mesh>
              
              <mesh position={[0, 0, -0.3]}>
                <cylinderGeometry args={[0.3, 0.15, 1.8, 12]} />
                <meshStandardMaterial 
                  color="#f0e68c" 
                  roughness={0.4}
                  metalness={0.02}
                />
              </mesh>
            </group>
          </>
        );
    }
  };

  return (
    <group 
      position={position} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={isSelected ? 1.2 : hovered ? 1.05 : 1}
    >
      {/* Main tooth structure */}
      <group ref={meshRef}>
        {renderToothGeometry()}

        {/* Cervical line / CEJ */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.08, 16]} />
          <meshStandardMaterial 
            color="#d4af37"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Preparation margin line */}
        {preparationProgress.marginPreparation && (
          <mesh position={[0, 0.3, 0]}>
            <torusGeometry args={[0.95, 0.03, 16, 32]} />
            <meshStandardMaterial 
              color={getMarginColor()}
              roughness={0.1}
              metalness={0.4}
              emissive={getMarginColor()}
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
      </group>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshStandardMaterial 
            color="#2196f3"
            transparent
            opacity={0.8}
            emissive="#1976d2"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Tool interaction effects */}
      {isSelected && currentTool === 'handpiece' && (
        <>
          {/* Water spray particles */}
          <group>
            {[...Array(10)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 0.8,
                1 + Math.random() * 0.5,
                (Math.random() - 0.5) * 0.8
              ]}>
                <sphereGeometry args={[0.02 + Math.random() * 0.01]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.6 + Math.random() * 0.3} />
              </mesh>
            ))}
          </group>
          
          {/* Cutting debris */}
          <group>
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 1,
                0.8 + Math.random() * 0.3,
                (Math.random() - 0.5) * 1
              ]}>
                <sphereGeometry args={[0.015 + Math.random() * 0.01]} />
                <meshStandardMaterial color="#deb887" />
              </mesh>
            ))}
          </group>
        </>
      )}

      {/* Probe measurement indicators */}
      {isSelected && currentTool === 'probe' && (
        <>
          <group position={[0.6, 1.0, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 0.5, 0.02]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            <Text
              position={[0.2, 0.2, 0]}
              fontSize={0.15}
              color="#ff6b6b"
              anchorX="center"
            >
              2.5mm
            </Text>
          </group>
        </>
      )}
    </group>
  );
};

const DentalOfficeScene = () => {
  const { state, dispatch } = useGame();
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [currentTool, setCurrentTool] = useState('handpiece');
  const [preparationSteps, setPreparationSteps] = useState({
    occlusalReduction: false,
    axialReduction: false,
    marginPreparation: false,
    finishingPolishing: false
  });
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const teeth = [
    { id: 1, position: [-3, 0, 0], quality: 'poor', type: 'molar' },
    { id: 2, position: [0, 0, 0], quality: 'good', type: 'premolar' },
    { id: 3, position: [3, 0, 0], quality: 'excellent', type: 'incisor' },
  ];

  const tools = [
    { 
      id: 'handpiece', 
      name: 'High-Speed Handpiece', 
      icon: Wrench, 
      description: 'Primary cutting tool for tooth preparation',
      color: 'bg-blue-500'
    },
    { 
      id: 'probe', 
      name: 'Periodontal Probe', 
      icon: CheckCircle, 
      description: 'Measurement and assessment tool',
      color: 'bg-green-500'
    },
    { 
      id: 'mirror', 
      name: 'Dental Mirror', 
      icon: RotateCcw, 
      description: 'Visualization and retraction tool',
      color: 'bg-purple-500'
    }
  ];

  const handleToothClick = (toothId) => {
    setSelectedTooth(toothId);
    const tooth = teeth.find(t => t.id === toothId);
    if (tooth) {
      provideFeedback(tooth.quality);
    }
  };

  const provideFeedback = async (quality) => {
    let feedbackMessage = '';
    let xpGain = 0;

    switch (quality) {
      case 'poor':
        feedbackMessage = "❌ This preparation shows several issues: inadequate occlusal reduction, rough margins, and potential undercuts. Remember to maintain 1.5-2mm occlusal clearance and create smooth, continuous margins.";
        xpGain = -5;
        break;
      case 'good':
        feedbackMessage = "⚠️ Good progress! The basic form is correct, but we can improve the margin definition and surface smoothness. Consider using finer burs for finishing.";
        xpGain = 5;
        break;
      case 'excellent':
        feedbackMessage = "✅ Excellent preparation! Perfect taper (6-8 degrees), adequate reduction, smooth margins, and proper finish line. This meets all clinical standards!";
        xpGain = 10;
        break;
    }

    setFeedback(feedbackMessage);
    setScore(prev => prev + xpGain);
    dispatch({ type: 'EARN_XP', payload: Math.max(0, xpGain) });
  };

  const handleStepComplete = (step) => {
    if (selectedTooth === null) {
      setFeedback("Please select a tooth first before performing any procedures.");
      return;
    }

    setIsWorking(true);
    
    setTimeout(() => {
      setPreparationSteps(prev => ({ ...prev, [step]: true }));
      
      const stepFeedback = {
        occlusalReduction: "Great! You've achieved adequate occlusal reduction. Remember to check clearance in all excursive movements.",
        axialReduction: "Excellent axial reduction! The taper looks good - aim for 6-8 degrees total convergence.",
        marginPreparation: "Perfect margin preparation! The chamfer finish line is well-defined and smooth.",
        finishingPolishing: "Outstanding finishing! The surface is smooth and ready for impression taking."
      };

      setFeedback(stepFeedback[step]);
      dispatch({ type: 'EARN_XP', payload: 15 });
      setScore(prev => prev + 15);
      setIsWorking(false);
    }, 2000);
  };

  const useTool = () => {
    if (selectedTooth === null) {
      setFeedback("Please select a tooth first before using any tools.");
      return;
    }

    setIsWorking(true);
    
    setTimeout(() => {
      const toolFeedback = {
        handpiece: "Good technique with the handpiece! Maintain steady pressure and use water cooling.",
        probe: "Probing depth measured. Check for adequate reduction and smooth margins.",
        mirror: "Good visualization. The mirror helps you see all preparation angles clearly."
      };

      setFeedback(toolFeedback[currentTool]);
      dispatch({ type: 'EARN_XP', payload: 5 });
      setScore(prev => prev + 5);
      setIsWorking(false);
    }, 1000);
  };

  // AI-powered preparation analysis
  const analyzePreparation = async () => {
    if (selectedTooth === null) {
      setFeedback("Please select a tooth first before analyzing.");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Get the selected tooth data
      const tooth = teeth.find(t => t.id === selectedTooth);
      
      // Prepare the data for analysis
      const meshData = null; // In a real app, this would be the 3D mesh data
      const measurements = {
        occlusalReduction: Math.random() * 2 + 1, // Simulate measurements
        axialReduction: Math.random() * 1.5 + 0.5,
        marginWidth: Math.random() * 0.8 + 0.2,
        taper: Math.random() * 6 + 4
      };
      
      // Call the AI service to analyze the preparation
      const analysis = await aiIntegrationService.analyzePreparation(meshData, measurements);
      
      setFeedback(analysis);
      dispatch({ type: 'EARN_XP', payload: 20 });
      setScore(prev => prev + 20);
    } catch (error) {
      console.error('Error analyzing preparation:', error);
      setFeedback("Error analyzing preparation. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetPreparation = () => {
    setPreparationSteps({
      occlusalReduction: false,
      axialReduction: false,
      marginPreparation: false,
      finishingPolishing: false
    });
    setSelectedTooth(null);
    setFeedback('');
    setScore(0);
  };

  return (
    <div className="h-full flex">
      {/* 3D Scene */}
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-white relative">
        <Canvas 
          camera={{ position: [0, 6, 12], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            {/* Enhanced Lighting for realistic appearance */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <pointLight position={[5, 8, 5]} intensity={0.8} />
            <pointLight position={[-5, 8, 5]} intensity={0.6} />
            <spotLight 
              position={[0, 10, 0]} 
              angle={0.3} 
              penumbra={0.1} 
              intensity={1.5}
            />
            
            {/* Scene Title */}
            <Text
              position={[0, 5, 0]}
              fontSize={0.8}
              color="#1e40af"
              anchorX="center"
              anchorY="middle"
            >
              Crown Preparation Simulation
            </Text>
            
            {/* Realistic Teeth Models */}
            {teeth.map((tooth) => (
              <RealisticToothModel
                key={tooth.id}
                position={tooth.position}
                isSelected={selectedTooth === tooth.id}
                onClick={() => handleToothClick(tooth.id)}
                preparationQuality={tooth.quality}
                currentTool={currentTool}
                preparationProgress={preparationSteps}
                toothType={tooth.type}
              />
            ))}
            
            {/* Dental chair/base with better materials */}
            <mesh position={[0, -2.5, 0]}>
              <boxGeometry args={[10, 0.3, 4]} />
              <meshStandardMaterial 
                color="#2c3e50" 
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            
            {/* Background elements */}
            <mesh position={[6, 2, -2]}>
              <boxGeometry args={[0.5, 8, 0.5]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
            <mesh position={[-6, 2, -2]}>
              <boxGeometry args={[0.5, 8, 0.5]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
            
            {/* Controls */}
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={25}
              minDistance={8}
              target={[0, 0, 0]}
              maxPolarAngle={Math.PI * 0.75}
              minPolarAngle={Math.PI * 0.1}
            />
          </Suspense>
        </Canvas>

        {/* Working indicator */}
        {(isWorking || isAnalyzing) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 z-10">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>{isAnalyzing ? 'Analyzing...' : 'Working...'}</span>
          </div>
        )}

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 max-w-md z-10 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-2">🦷 Simulation Guide</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Click</strong> on a tooth to select it</li>
            <li>• <strong>Choose</strong> a tool from the right panel</li>
            <li>• <strong>Use</strong> the tool button to interact</li>
            <li>• <strong>Complete</strong> preparation steps in sequence</li>
            <li>• <strong>Mouse:</strong> drag to rotate, scroll to zoom</li>
          </ul>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Score Display */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Current Score</h3>
                <p className="text-2xl font-bold">{score} XP</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-300" />
            </div>
          </div>

          {/* Tool Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Tool</h3>
            <div className="space-y-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setCurrentTool(tool.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                      currentTool === tool.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-sm text-gray-500">{tool.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={useTool}
              disabled={isWorking || selectedTooth === null}
              className="w-full mt-3 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWorking ? 'Working...' : `Use ${tools.find(t => t.id === currentTool)?.name}`}
            </button>
          </div>

          {/* AI Analysis Button */}
          <div>
            <button
              onClick={analyzePreparation}
              disabled={isAnalyzing || selectedTooth === null}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Analyzing Preparation...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Analyze Preparation</span>
                </>
              )}
            </button>
          </div>

          {/* Preparation Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation Steps</h3>
            <div className="space-y-2">
              {Object.entries(preparationSteps).map(([step, completed]) => (
                <button
                  key={step}
                  onClick={() => !completed && handleStepComplete(step)}
                  disabled={completed || isWorking || selectedTooth === null}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                    completed
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : selectedTooth === null
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">
                      {step.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {completed && <CheckCircle className="w-5 h-5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Panel */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Instructor Feedback</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={resetPreparation}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Reset Preparation
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'EARN_XP', payload: 50 });
                setFeedback("🎉 Simulation completed! You've mastered the fundamentals of crown preparation. Keep practicing to perfect your technique!");
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
            >
              Complete Simulation
            </button>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pro Tips
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Click on a tooth to select it first</li>
              <li>• Choose your tool before working</li>
              <li>• Maintain 6-8° total convergence angle</li>
              <li>• Ensure 1.5-2mm occlusal reduction</li>
              <li>• Create smooth, continuous margins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalOfficeScene;