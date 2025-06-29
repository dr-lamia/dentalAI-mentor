import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Palette, Zap, CheckCircle, AlertTriangle, Settings, Award } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Material } from '../../types';

const LaboratoryScene: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [currentStep, setCurrentStep] = useState<'material-selection' | 'design' | 'milling' | 'finishing'>('material-selection');
  const [patientCase, setPatientCase] = useState({
    age: 45,
    tooth: '#8 (Maxillary Central Incisor)',
    requirements: ['High esthetics', 'Anterior region', 'Normal occlusion'],
    contraindications: ['Bruxism', 'Heavy occlusal forces']
  });
  const [designParameters, setDesignParameters] = useState({
    thickness: 1.5,
    margin: 'chamfer',
    contour: 'natural',
    occlusion: 'balanced'
  });
  const [millingProgress, setMillingProgress] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const materials: Material[] = [
    {
      id: 'pfm',
      name: 'Porcelain-Fused-to-Metal (PFM)',
      type: 'PFM',
      properties: {
        strength: 85,
        aesthetics: 70,
        durability: 90,
        biocompatibility: 75
      },
      indications: ['Posterior crowns', 'Bridges', 'High stress areas'],
      contraindications: ['High esthetic demands', 'Metal allergies'],
      cost: 'medium'
    },
    {
      id: 'zirconia',
      name: 'Zirconia',
      type: 'zirconia',
      properties: {
        strength: 95,
        aesthetics: 85,
        durability: 95,
        biocompatibility: 95
      },
      indications: ['High stress areas', 'Posterior crowns', 'Bridges', 'Implant crowns'],
      contraindications: ['Thin preparations', 'Opposing natural teeth (wear)'],
      cost: 'high'
    },
    {
      id: 'lithium-disilicate',
      name: 'Lithium Disilicate',
      type: 'lithium-disilicate',
      properties: {
        strength: 75,
        aesthetics: 95,
        durability: 80,
        biocompatibility: 90
      },
      indications: ['Anterior crowns', 'Veneers', 'Inlays/Onlays', 'High esthetic demands'],
      contraindications: ['Heavy bruxism', 'Insufficient tooth structure'],
      cost: 'high'
    },
    {
      id: 'composite',
      name: 'Composite Resin',
      type: 'composite',
      properties: {
        strength: 60,
        aesthetics: 80,
        durability: 65,
        biocompatibility: 85
      },
      indications: ['Temporary restorations', 'Small restorations', 'Repairs'],
      contraindications: ['Large restorations', 'High stress areas'],
      cost: 'low'
    }
  ];

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
    
    // Provide feedback based on case requirements
    let feedbackMessage = '';
    
    if (material.type === 'lithium-disilicate') {
      feedbackMessage = "✅ Excellent choice! Lithium disilicate is ideal for anterior crowns requiring high esthetics. Its translucency and strength make it perfect for this maxillary central incisor.";
      dispatch({ type: 'EARN_XP', payload: 15 });
    } else if (material.type === 'zirconia') {
      feedbackMessage = "⚠️ Good material choice for strength, but consider that zirconia may be overly opaque for an anterior central incisor. Layered zirconia could improve esthetics.";
      dispatch({ type: 'EARN_XP', payload: 10 });
    } else if (material.type === 'PFM') {
      feedbackMessage = "❌ PFM is not ideal for anterior esthetics due to the metal substructure. The gingival margin may show a dark line over time.";
      dispatch({ type: 'EARN_XP', payload: 5 });
    } else {
      feedbackMessage = "❌ Composite is not suitable for full crown restorations due to insufficient strength and durability.";
      dispatch({ type: 'EARN_XP', payload: 0 });
    }
    
    setFeedback(feedbackMessage);
  };

  const startMilling = () => {
    setCurrentStep('milling');
    setMillingProgress(0);
    
    const interval = setInterval(() => {
      setMillingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentStep('finishing');
          dispatch({ type: 'EARN_XP', payload: 20 });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const PropertyBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Patient Case Panel */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Case Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Beaker className="w-6 h-6 mr-2 text-purple-600" />
              Laboratory Case
            </h2>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Patient Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Age:</span>
                  <span className="font-medium text-blue-900">{patientCase.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Tooth:</span>
                  <span className="font-medium text-blue-900">{patientCase.tooth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Case Requirements</h3>
            <ul className="space-y-2">
              {patientCase.requirements.map((req, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contraindications */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contraindications</h3>
            <ul className="space-y-2">
              {patientCase.contraindications.map((contra, index) => (
                <li key={index} className="flex items-center text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{contra}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Step */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-2">Current Step</h3>
            <p className="text-purple-100 capitalize text-sm">
              {currentStep.replace('-', ' ')}
            </p>
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-purple-100">Progress</span>
                <span className="text-xs text-purple-100">
                  {currentStep === 'material-selection' ? '25%' : 
                   currentStep === 'design' ? '50%' : 
                   currentStep === 'milling' ? '75%' : '100%'}
                </span>
              </div>
              <div className="w-full bg-purple-400/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: currentStep === 'material-selection' ? '25%' : 
                           currentStep === 'design' ? '50%' : 
                           currentStep === 'milling' ? '75%' : '100%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Lab Technician Feedback</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Laboratory Area */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Material Selection */}
            {currentStep === 'material-selection' && (
              <motion.div
                key="material-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Material Selection</h1>
                  <p className="text-gray-600 text-lg">Choose the most appropriate material for this anterior crown</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {materials.map((material) => (
                    <motion.div
                      key={material.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleMaterialSelect(material)}
                      className={`bg-white rounded-2xl shadow-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                        selectedMaterial?.id === material.id
                          ? 'border-purple-500 shadow-purple-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-gray-900 text-lg">{material.name}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            material.cost === 'low' ? 'bg-green-100 text-green-700' :
                            material.cost === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {material.cost} cost
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <PropertyBar label="Strength" value={material.properties.strength} color="bg-red-500" />
                          <PropertyBar label="Aesthetics" value={material.properties.aesthetics} color="bg-pink-500" />
                          <PropertyBar label="Durability" value={material.properties.durability} color="bg-blue-500" />
                          <PropertyBar label="Biocompatibility" value={material.properties.biocompatibility} color="bg-green-500" />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm mb-1">Indications</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {material.indications.slice(0, 2).map((indication, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="text-green-500 mr-1">•</span>
                                  {indication}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedMaterial && (
                  <div className="text-center">
                    <button
                      onClick={() => setCurrentStep('design')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium text-lg"
                    >
                      Proceed to Design Phase
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Design Phase */}
            {currentStep === 'design' && selectedMaterial && (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Crown Design</h1>
                  <p className="text-gray-600 text-lg">Configure the crown geometry for {selectedMaterial.name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Design Parameters */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Settings className="w-6 h-6 mr-2 text-purple-600" />
                      Design Parameters
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wall Thickness (mm)
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.1"
                          value={designParameters.thickness}
                          onChange={(e) => setDesignParameters(prev => ({...prev, thickness: parseFloat(e.target.value)}))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0.5mm</span>
                          <span className="font-medium">{designParameters.thickness}mm</span>
                          <span>2.5mm</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Margin Design
                        </label>
                        <select
                          value={designParameters.margin}
                          onChange={(e) => setDesignParameters(prev => ({...prev, margin: e.target.value}))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="chamfer">Chamfer</option>
                          <option value="shoulder">Shoulder</option>
                          <option value="knife-edge">Knife Edge</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Crown Contour
                        </label>
                        <select
                          value={designParameters.contour}
                          onChange={(e) => setDesignParameters(prev => ({...prev, contour: e.target.value}))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="natural">Natural Contour</option>
                          <option value="reduced">Reduced Contour</option>
                          <option value="over-contoured">Over-contoured</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3D Preview */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Palette className="w-6 h-6 mr-2 text-purple-600" />
                      3D Preview
                    </h3>

                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🦷</div>
                        <p className="text-gray-600 font-medium">Crown Design Preview</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedMaterial.name}<br/>
                          {designParameters.thickness}mm thickness<br/>
                          {designParameters.margin} margin
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Material</span>
                        <span className="text-sm text-gray-900">{selectedMaterial.name}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Thickness</span>
                        <span className="text-sm text-gray-900">{designParameters.thickness}mm</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Margin</span>
                        <span className="text-sm text-gray-900 capitalize">{designParameters.margin}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={startMilling}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium text-lg"
                  >
                    Start Virtual Milling
                  </button>
                </div>
              </motion.div>
            )}

            {/* Milling Phase */}
            {currentStep === 'milling' && (
              <motion.div
                key="milling"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Virtual Milling Process</h1>
                  <p className="text-gray-600 text-lg">CAD/CAM milling simulation in progress</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                      <div className="text-8xl mb-4">⚙️</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Milling in Progress</h3>
                      <p className="text-gray-600">Creating your {selectedMaterial?.name} crown</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{millingProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-600 h-4 rounded-full transition-all duration-200"
                          style={{ width: `${millingProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Material:</span>
                        <p className="text-gray-900">{selectedMaterial?.name}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Thickness:</span>
                        <p className="text-gray-900">{designParameters.thickness}mm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Finishing Phase */}
            {currentStep === 'finishing' && (
              <motion.div
                key="finishing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Crown Completed!</h1>
                  <p className="text-gray-600 text-lg">Your {selectedMaterial?.name} crown is ready for delivery</p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                      <div className="text-8xl mb-4">👑</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Laboratory Work Complete</h3>
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Quality Control Passed</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-6 bg-blue-50 rounded-xl">
                        <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-blue-900 mb-2">Material Selection</h4>
                        <p className="text-sm text-blue-700">Optimal choice for anterior esthetics</p>
                      </div>
                      <div className="text-center p-6 bg-purple-50 rounded-xl">
                        <Settings className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-purple-900 mb-2">Design Parameters</h4>
                        <p className="text-sm text-purple-700">Proper thickness and contour</p>
                      </div>
                      <div className="text-center p-6 bg-green-50 rounded-xl">
                        <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-green-900 mb-2">Milling Precision</h4>
                        <p className="text-sm text-green-700">CAD/CAM accuracy achieved</p>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <button
                        onClick={() => {
                          dispatch({ type: 'EARN_XP', payload: 50 });
                          const badge = {
                            id: `lab-master-${Date.now()}`,
                            name: 'Laboratory Master',
                            description: 'Successfully completed crown fabrication',
                            icon: '🏆',
                            earnedAt: new Date(),
                            rarity: 'epic' as const,
                            color: 'text-purple-500'
                          };
                          dispatch({ type: 'EARN_BADGE', payload: badge });
                          setFeedback("🎉 Congratulations! You've mastered the laboratory workflow from material selection to final crown delivery. Your understanding of prosthodontic principles is excellent!");
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium text-lg"
                      >
                        Complete Laboratory Session
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStep('material-selection');
                          setSelectedMaterial(null);
                          setMillingProgress(0);
                          setFeedback('');
                        }}
                        className="block mx-auto px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Start New Case
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryScene;