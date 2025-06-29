import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, Play } from 'lucide-react';
import ModuleCard from './ModuleCard';
import { Module, DentalSpecialty } from '../../types';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

interface ModulesGridProps {
  onSceneSelect?: (scene: string) => void;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({ onSceneSelect }) => {
  const { state, dispatch } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<DentalSpecialty | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTopic, setGeneratedTopic] = useState('');
  const [modules, setModules] = useState<Module[]>([
    // Interactive Scene Modules
    {
      id: 'dental-office-sim',
      title: 'Crown Preparation Simulation',
      description: 'Interactive 3D simulation for learning proper crown preparation techniques with real-time feedback.',
      icon: '🦷',
      specialty: 'prosthodontics',
      difficulty: 'intermediate',
      estimatedTime: 45,
      xpReward: 75,
      isLocked: false,
      completionRate: 0,
      moduleType: 'dental-office'
    },
    {
      id: 'lecture-room-rag',
      title: 'AI-Powered Dental Q&A',
      description: 'Interactive lecture room with AI mentor using your uploaded notes for contextual learning.',
      icon: '🎓',
      specialty: 'endodontics',
      difficulty: 'beginner',
      estimatedTime: 30,
      xpReward: 50,
      isLocked: false,
      completionRate: 0,
      moduleType: 'lecture-room'
    },
    {
      id: 'diagnosis-cases',
      title: 'Clinical Case Diagnosis',
      description: 'Analyze real patient cases with X-rays and clinical photos to develop diagnostic skills.',
      icon: '🔬',
      specialty: 'oral-medicine',
      difficulty: 'advanced',
      estimatedTime: 60,
      xpReward: 100,
      isLocked: false,
      completionRate: 0,
      moduleType: 'diagnosis-treatment'
    },
    {
      id: 'laboratory-workflow',
      title: 'Digital Laboratory Workflow',
      description: 'Learn material selection, crown design, and CAD/CAM milling in a virtual laboratory.',
      icon: '⚗️',
      specialty: 'prosthodontics',
      difficulty: 'advanced',
      estimatedTime: 75,
      xpReward: 110,
      isLocked: false,
      completionRate: 0,
      moduleType: 'laboratory'
    },
    // Traditional Learning Modules
    {
      id: '1',
      title: 'Root Canal Therapy Fundamentals',
      description: 'Master the essential techniques of endodontic treatment, from diagnosis to obturation.',
      icon: '🦷',
      specialty: 'endodontics',
      difficulty: 'intermediate',
      estimatedTime: 45,
      xpReward: 75,
      isLocked: false,
      completionRate: 85,
      moduleType: 'dental-office'
    },
    {
      id: '2',
      title: 'Periodontal Disease Management',
      description: 'Comprehensive approach to treating gum diseases and maintaining periodontal health.',
      icon: '🫧',
      specialty: 'periodontics',
      difficulty: 'intermediate',
      estimatedTime: 60,
      xpReward: 90,
      isLocked: false,
      completionRate: 60,
      moduleType: 'lecture-room'
    },
    {
      id: '3',
      title: 'Crown and Bridge Preparation',
      description: 'Learn the precise techniques for full coverage restorations and fixed prosthodontics.',
      icon: '👑',
      specialty: 'prosthodontics',
      difficulty: 'advanced',
      estimatedTime: 90,
      xpReward: 120,
      isLocked: false,
      completionRate: 30,
      moduleType: 'dental-office'
    },
    {
      id: '4',
      title: 'Orthodontic Treatment Planning',
      description: 'Develop skills in analyzing malocclusions and creating comprehensive treatment plans.',
      icon: '🦴',
      specialty: 'orthodontics',
      difficulty: 'advanced',
      estimatedTime: 75,
      xpReward: 100,
      isLocked: true,
      completionRate: 0,
      moduleType: 'diagnosis-treatment'
    },
    {
      id: '5',
      title: 'Pediatric Dental Care',
      description: 'Specialized techniques for treating children and managing their dental needs.',
      icon: '🧸',
      specialty: 'pedodontics',
      difficulty: 'beginner',
      estimatedTime: 30,
      xpReward: 50,
      isLocked: false,
      completionRate: 100,
      moduleType: 'lecture-room'
    },
    {
      id: '6',
      title: 'Oral Surgery Basics',
      description: 'Introduction to surgical procedures including extractions and soft tissue management.',
      icon: '🔪',
      specialty: 'oral-surgery',
      difficulty: 'intermediate',
      estimatedTime: 50,
      xpReward: 80,
      isLocked: false,
      completionRate: 0,
      moduleType: 'dental-office'
    },
    {
      id: '7',
      title: 'Dental Radiography Interpretation',
      description: 'Master the art of reading and interpreting various types of dental X-rays.',
      icon: '📸',
      specialty: 'radiology',
      difficulty: 'beginner',
      estimatedTime: 40,
      xpReward: 60,
      isLocked: false,
      completionRate: 20,
      moduleType: 'diagnosis-treatment'
    },
    {
      id: '8',
      title: 'Oral Pathology Recognition',
      description: 'Identify and understand various oral pathological conditions and lesions.',
      icon: '🔍',
      specialty: 'oral-medicine',
      difficulty: 'advanced',
      estimatedTime: 55,
      xpReward: 85,
      isLocked: true,
      completionRate: 0,
      moduleType: 'diagnosis-treatment'
    }
  ]);

  const specialties = [
    'endodontics', 'periodontics', 'prosthodontics', 'orthodontics',
    'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology'
  ];

  useEffect(() => {
    // Check for any saved modules in localStorage
    const savedModules = localStorage.getItem('dentalMentorModules');
    if (savedModules) {
      try {
        const parsedModules = JSON.parse(savedModules);
        setModules(prevModules => [...prevModules, ...parsedModules]);
      } catch (error) {
        console.error('Error parsing saved modules:', error);
      }
    }
  }, []);

  const generateAIModule = async () => {
    setIsGenerating(true);
    try {
      // Generate a random topic if none is provided
      const topics = [
        'Dental Implant Placement', 
        'Composite Restoration Techniques', 
        'Dental Trauma Management',
        'Dental Materials Science',
        'Occlusion and TMJ Disorders'
      ];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const topic = generatedTopic || randomTopic;
      
      // Use AI service to generate module content
      const moduleData = await aiIntegrationService.generateModule(topic);
      
      // Create new module object
      const newModule = {
        id: `ai-generated-${Date.now()}`,
        title: `AI-Generated: ${topic}`,
        description: `AI-generated learning module about ${topic} with personalized content.`,
        icon: '🤖',
        specialty: (moduleData.specialty as DentalSpecialty) || 'prosthodontics',
        difficulty: (moduleData.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
        estimatedTime: moduleData.estimatedTime || 30,
        xpReward: 100,
        isLocked: false,
        completionRate: 0,
        moduleType: 'lecture-room',
        aiGenerated: true,
        content: moduleData.content || `This is an AI-generated module about ${topic}.`
      };
      
      // Add to modules list
      setModules(prevModules => {
        const updatedModules = [...prevModules, newModule];
        // Save to localStorage
        localStorage.setItem('dentalMentorModules', JSON.stringify(
          updatedModules.filter(m => m.aiGenerated)
        ));
        return updatedModules;
      });
      
      // Award XP for generating content
      dispatch({ type: 'EARN_XP', payload: 15 });
      
      // Reset form
      setGeneratedTopic('');
    } catch (error) {
      console.error('Error generating AI module:', error);
      // Create a fallback module if AI generation fails
      const fallbackModule = {
        id: `ai-generated-${Date.now()}`,
        title: `AI-Generated: ${generatedTopic || 'Dental Education'}`,
        description: 'Personalized learning module with AI-enhanced content.',
        icon: '🤖',
        specialty: 'prosthodontics',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 100,
        isLocked: false,
        completionRate: 0,
        moduleType: 'lecture-room',
        aiGenerated: true
      };
      
      setModules(prevModules => [...prevModules, fallbackModule]);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || module.specialty === selectedSpecialty;
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

  const handleStartModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && ['dental-office-sim', 'lecture-room-rag', 'diagnosis-cases', 'laboratory-workflow'].includes(moduleId)) {
      // Launch interactive scene
      const sceneMap: Record<string, string> = {
        'dental-office-sim': 'dental-office',
        'lecture-room-rag': 'lecture-room',
        'diagnosis-cases': 'diagnosis-treatment',
        'laboratory-workflow': 'laboratory'
      };
      onSceneSelect?.(sceneMap[moduleId]);
    } else {
      // Handle traditional module start
      console.log('Starting traditional module:', moduleId);
      // Track module progress
      const updatedModules = modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            completionRate: m.completionRate > 0 ? m.completionRate + 10 : 10
          };
        }
        return m;
      });
      setModules(updatedModules);
      
      // Award XP for starting a module
      dispatch({ type: 'EARN_XP', payload: 5 });
    }
  };

  // Separate interactive and traditional modules
  const interactiveModules = filteredModules.filter(m => 
    ['dental-office-sim', 'lecture-room-rag', 'diagnosis-cases', 'laboratory-workflow'].includes(m.id)
  );
  const traditionalModules = filteredModules.filter(m => 
    !['dental-office-sim', 'lecture-room-rag', 'diagnosis-cases', 'laboratory-workflow'].includes(m.id)
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Learning Modules</h1>
          <p className="text-gray-600 text-sm sm:text-base">Choose from our comprehensive dental education courses and interactive simulations</p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span>{filteredModules.length} modules available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value as DentalSpecialty | 'all')}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
            >
              <option value="all">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* AI Module Generator */}
          <div className="relative">
            <input
              type="text"
              placeholder="Generate AI module on topic..."
              value={generatedTopic}
              onChange={(e) => setGeneratedTopic(e.target.value)}
              className="w-full pl-4 pr-24 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <button
              onClick={generateAIModule}
              disabled={isGenerating}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md text-xs font-medium"
            >
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modules Section */}
      {interactiveModules.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">🎮 Interactive Simulations</h2>
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              New!
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {interactiveModules.map(module => (
              <div key={module.id} className="relative">
                <ModuleCard
                  module={module}
                  onStart={handleStartModule}
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  INTERACTIVE
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traditional Modules Section */}
      {traditionalModules.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">📚 Learning Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {traditionalModules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                onStart={handleStartModule}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default ModulesGrid;