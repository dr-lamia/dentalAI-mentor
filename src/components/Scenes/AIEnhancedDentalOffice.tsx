import React, { useState } from 'react';
import { Wrench, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

const AIEnhancedDentalOffice: React.FC = () => {
  const { dispatch } = useGame();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [preparationData, setPreparationData] = useState({
    meshData: null,
    measurements: {
      occlusalReduction: 0,
      axialReduction: 0,
      marginWidth: 0,
      taper: 0
    }
  });
  const [feedback, setFeedback] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Map "Analyze Prep" button to POST /analyze_prep
  const handleAnalyzePreparation = async () => {
    if (!selectedTooth || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // Use AI Integration Service to analyze preparation
      const analysis = await aiIntegrationService.analyzePreparation(
        preparationData.meshData,
        preparationData.measurements
      );

      setFeedback(analysis);
      
      // Award XP for using analysis
      dispatch({ type: 'EARN_XP', payload: 15 });
    } catch (error) {
      console.error('Error analyzing preparation:', error);
      setFeedback('Error analyzing preparation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToothSelect = (toothId: number) => {
    setSelectedTooth(toothId);
    // Simulate measurement updates
    setPreparationData(prev => ({
      ...prev,
      measurements: {
        occlusalReduction: Math.random() * 3,
        axialReduction: Math.random() * 2,
        marginWidth: Math.random() * 1,
        taper: Math.random() * 10 + 5
      }
    }));
  };

  return (
    <div className="h-full flex">
      {/* 3D Scene Area */}
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-white relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4">🦷</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3D Tooth Preparation</h2>
            <p className="text-gray-600 mb-6">Select a tooth to begin preparation analysis</p>
            
            {/* Tooth Selection */}
            <div className="flex space-x-4 justify-center mb-6">
              {[1, 2, 3].map((toothId) => (
                <button
                  key={toothId}
                  onClick={() => handleToothSelect(toothId)}
                  className={`w-16 h-16 rounded-full border-2 transition-all duration-200 ${
                    selectedTooth === toothId
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  #{toothId}
                </button>
              ))}
            </div>

            {/* Measurements Display */}
            {selectedTooth && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Preparation Measurements</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Occlusal Reduction:</span>
                    <span className="font-medium ml-2">{preparationData.measurements.occlusalReduction.toFixed(1)}mm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Axial Reduction:</span>
                    <span className="font-medium ml-2">{preparationData.measurements.axialReduction.toFixed(1)}mm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Margin Width:</span>
                    <span className="font-medium ml-2">{preparationData.measurements.marginWidth.toFixed(1)}mm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Taper Angle:</span>
                    <span className="font-medium ml-2">{preparationData.measurements.taper.toFixed(1)}°</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Analysis Button */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
            <button
              onClick={handleAnalyzePreparation}
              disabled={!selectedTooth || isAnalyzing}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5" />
                  <span>Analyze Prep</span>
                </>
              )}
            </button>
          </div>

          {/* AI Feedback */}
          {feedback && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                AI Feedback
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">{feedback}</p>
            </div>
          )}

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preparation Tools</h3>
            <div className="space-y-2">
              {[
                { name: 'High-Speed Handpiece', icon: Wrench },
                { name: 'Periodontal Probe', icon: CheckCircle },
                { name: 'Finishing Burs', icon: AlertTriangle }
              ].map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={index}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Maintain 6-8° total convergence</li>
              <li>• Ensure 1.5-2mm occlusal reduction</li>
              <li>• Create smooth, continuous margins</li>
              <li>• Use AI analysis for real-time feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEnhancedDentalOffice;