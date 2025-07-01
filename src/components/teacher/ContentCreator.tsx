import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileQuestion, Stethoscope, Loader, CheckCircle, AlertCircle, Plus, Search, Filter, Edit, Trash2, Eye, Download, X } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'module' | 'case-study';
  specialty: string;
  difficulty: string;
  createdAt: Date;
  questions: number;
  published: boolean;
}

const ContentCreator: React.FC = () => {
  const { state, dispatch } = useGame();
  const [contentType, setContentType] = useState<'quiz' | 'module' | 'case-study'>('quiz');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'>('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  
  // New content form state
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    title: '',
    description: '',
    type: 'quiz',
    specialty: 'endodontics',
    difficulty: 'medium',
    questions: 5,
    published: false
  });

  // Mock content items
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Root Canal Therapy Quiz',
      description: 'Test knowledge on endodontic procedures and principles',
      type: 'quiz',
      specialty: 'endodontics',
      difficulty: 'medium',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      questions: 10,
      published: true
    },
    {
      id: '2',
      title: 'Crown Preparation Guide',
      description: 'Comprehensive learning module on crown preparation techniques',
      type: 'module',
      specialty: 'prosthodontics',
      difficulty: 'intermediate',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      questions: 5,
      published: true
    },
    {
      id: '3',
      title: 'Complex Periodontal Case',
      description: 'Case study on advanced periodontal disease management',
      type: 'case-study',
      specialty: 'periodontics',
      difficulty: 'hard',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      questions: 3,
      published: true
    },
    {
      id: '4',
      title: 'Dental Implant Placement',
      description: 'Step-by-step module on implant placement procedures',
      type: 'module',
      specialty: 'oral-surgery',
      difficulty: 'advanced',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      questions: 8,
      published: false
    }
  ]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationStatus('idle');

    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newItem: ContentItem = {
        id: `content-${Date.now()}`,
        title: `${topic} ${contentType === 'quiz' ? 'Quiz' : contentType === 'module' ? 'Module' : 'Case Study'}`,
        description: `AI-generated ${contentType} about ${topic}`,
        type: contentType,
        specialty: topic.toLowerCase().includes('endo') ? 'endodontics' :
                  topic.toLowerCase().includes('perio') ? 'periodontics' :
                  topic.toLowerCase().includes('crown') || topic.toLowerCase().includes('prosth') ? 'prosthodontics' :
                  topic.toLowerCase().includes('surg') ? 'oral-surgery' :
                  topic.toLowerCase().includes('ortho') ? 'orthodontics' : 'general',
        difficulty: contentType === 'module' ? 
                    (difficulty as 'beginner' | 'intermediate' | 'advanced') : 
                    (difficulty as 'easy' | 'medium' | 'hard'),
        createdAt: new Date(),
        questions: numQuestions,
        published: false
      };
      
      setContentItems(prev => [newItem, ...prev]);
      setGenerationStatus('success');
      
      // Award XP for generating content
      dispatch({ type: 'EARN_XP', payload: 15 });
      
      // Reset form
      setTopic('');
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateContent = () => {
    if (!newContent.title) return;
    
    const content: ContentItem = {
      id: `content-${Date.now()}`,
      title: newContent.title,
      description: newContent.description || '',
      type: newContent.type as 'quiz' | 'module' | 'case-study',
      specialty: newContent.specialty || 'general',
      difficulty: newContent.difficulty as string,
      createdAt: new Date(),
      questions: newContent.questions || 5,
      published: newContent.published || false
    };
    
    setContentItems(prev => [content, ...prev]);
    setShowContentModal(false);
    setNewContent({
      title: '',
      description: '',
      type: 'quiz',
      specialty: 'endodontics',
      difficulty: 'medium',
      questions: 5,
      published: false
    });
  };

  const handleUpdateContent = () => {
    if (!editingContent) return;
    
    setContentItems(prev => prev.map(item => 
      item.id === editingContent.id ? editingContent : item
    ));
    
    setEditingContent(null);
  };

  const handleDeleteContent = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };

  const handleTogglePublish = (id: string) => {
    setContentItems(prev => prev.map(item => 
      item.id === id ? {...item, published: !item.published} : item
    ));
  };

  const contentTypes = [
    {
      id: 'quiz',
      name: 'Quiz',
      description: 'Multiple choice questions with explanations',
      icon: FileQuestion,
      color: 'blue'
    },
    {
      id: 'module',
      name: 'Learning Module',
      description: 'Comprehensive study material with practice questions',
      icon: BookOpen,
      color: 'green'
    },
    {
      id: 'case-study',
      name: 'Case Study',
      description: 'Patient scenarios with open-ended questions',
      icon: Stethoscope,
      color: 'purple'
    }
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSpecialty = filterSpecialty === 'all' || item.specialty === filterSpecialty;
    
    return matchesSearch && matchesType && matchesSpecialty;
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <FileQuestion className="w-5 h-5 text-blue-600" />;
      case 'module':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'case-study':
        return <Stethoscope className="w-5 h-5 text-purple-600" />;
      default:
        return <FileQuestion className="w-5 h-5 text-gray-600" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-700';
      case 'module':
        return 'bg-green-100 text-green-700';
      case 'case-study':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'medium':
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Creator</h2>
          <p className="text-gray-600">Generate AI-powered educational content for your students</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowContentModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Manually</span>
          </button>
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Content Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = contentType === type.id;
            
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setContentType(type.id as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    type.color === 'blue' ? 'bg-blue-100' :
                    type.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      type.color === 'blue' ? 'text-blue-600' :
                      type.color === 'green' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Crown Preparation, Endodontic Treatment"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {contentType === 'module' ? (
                <>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </>
              ) : (
                <>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </>
              )}
            </select>
          </div>

          {contentType === 'quiz' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate {contentTypes.find(t => t.id === contentType)?.name}</span>
            )}
          </button>
        </div>
      </div>

      {/* Generation Status */}
      <AnimatePresence>
        {generationStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              generationStatus === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {generationStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {generationStatus === 'success'
                  ? 'Content generated successfully!'
                  : 'Failed to generate content. Please try again.'
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quizzes</option>
              <option value="module">Modules</option>
              <option value="case-study">Case Studies</option>
            </select>
            
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Specialties</option>
              <option value="endodontics">Endodontics</option>
              <option value="periodontics">Periodontics</option>
              <option value="prosthodontics">Prosthodontics</option>
              <option value="orthodontics">Orthodontics</option>
              <option value="oral-surgery">Oral Surgery</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.type === 'quiz' ? 'bg-blue-100' :
                  item.type === 'module' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {getContentTypeIcon(item.type)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getContentTypeColor(item.type)}`}>
                  {item.type.replace('-', ' ')}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(item.difficulty)}`}>
                {item.difficulty}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-gray-500 capitalize">{item.specialty.replace('-', ' ')}</span>
              <span className="text-gray-500">{item.questions} questions</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500">
                Created {item.createdAt.toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setEditingContent(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteContent(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleTogglePublish(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  item.published
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {item.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters, or create new content</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowContentModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Manually
            </button>
            <button
              onClick={() => {
                setTopic('');
                setContentType('quiz');
                setDifficulty('medium');
                setNumQuestions(5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Use AI Generator
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Content Modal */}
      <AnimatePresence>
        {(showContentModal || editingContent) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowContentModal(false);
              setEditingContent(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingContent ? 'Edit Content' : 'Create New Content'}
                </h3>
                <button
                  onClick={() => {
                    setShowContentModal(false);
                    setEditingContent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingContent?.title || newContent.title}
                    onChange={(e) => {
                      if (editingContent) {
                        setEditingContent({...editingContent, title: e.target.value});
                      } else {
                        setNewContent({...newContent, title: e.target.value});
                      }
                    }}
                    placeholder="Enter content title"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type & Specialty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={editingContent?.type || newContent.type}
                      onChange={(e) => {
                        const value = e.target.value as ContentItem['type'];
                        if (editingContent) {
                          setEditingContent({...editingContent, type: value});
                        } else {
                          setNewContent({...newContent, type: value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="quiz">Quiz</option>
                      <option value="module">Learning Module</option>
                      <option value="case-study">Case Study</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <select
                      value={editingContent?.specialty || newContent.specialty}
                      onChange={(e) => {
                        if (editingContent) {
                          setEditingContent({...editingContent, specialty: e.target.value});
                        } else {
                          setNewContent({...newContent, specialty: e.target.value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="endodontics">Endodontics</option>
                      <option value="periodontics">Periodontics</option>
                      <option value="prosthodontics">Prosthodontics</option>
                      <option value="orthodontics">Orthodontics</option>
                      <option value="oral-surgery">Oral Surgery</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                {/* Difficulty & Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={editingContent?.difficulty || newContent.difficulty}
                      onChange={(e) => {
                        if (editingContent) {
                          setEditingContent({...editingContent, difficulty: e.target.value});
                        } else {
                          setNewContent({...newContent, difficulty: e.target.value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {(editingContent?.type || newContent.type) === 'module' ? (
                        <>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </>
                      ) : (
                        <>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingContent?.questions || newContent.questions}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (editingContent) {
                          setEditingContent({...editingContent, questions: value});
                        } else {
                          setNewContent({...newContent, questions: value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingContent?.description || newContent.description}
                    onChange={(e) => {
                      if (editingContent) {
                        setEditingContent({...editingContent, description: e.target.value});
                      } else {
                        setNewContent({...newContent, description: e.target.value});
                      }
                    }}
                    placeholder="Enter content description"
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Published Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={editingContent?.published || newContent.published}
                    onChange={(e) => {
                      if (editingContent) {
                        setEditingContent({...editingContent, published: e.target.checked});
                      } else {
                        setNewContent({...newContent, published: e.target.checked});
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    Publish immediately
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowContentModal(false);
                      setEditingContent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingContent ? handleUpdateContent : handleCreateContent}
                    disabled={!(editingContent?.title || newContent.title)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingContent ? 'Update Content' : 'Create Content'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentCreator;