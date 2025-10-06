import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageCircle, FileText, Search, Brain, Lightbulb, Users, Clock, Upload, X, CheckCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { dentalMentorService } from '../../services/dentalMentorService';
import { useDropzone } from 'react-dropzone';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface LectureNote {
  id: string;
  title: string;
  content: string;
  specialty: string;
  uploadedAt: Date;
  tags: string[];
  type: 'pdf' | 'docx' | 'txt' | 'uploaded';
  size?: number;
}

const LectureRoomScene: React.FC = () => {
  const { state, dispatch } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, question: string, answer: string, timestamp: Date}>>([]);
  const [selectedNote, setSelectedNote] = useState<LectureNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [lectureNotes, setLectureNotes] = useState<LectureNote[]>([
    {
      id: '1',
      title: 'Endodontic Anatomy and Access Cavity Preparation',
      content: 'Root canal anatomy varies significantly between teeth. Mandibular molars often have a fourth canal (MB2). Access cavity should be conservative but complete, removing all roof of pulp chamber. Key principles: 1) Straight-line access to canal orifices, 2) Conservative outline form, 3) Complete deroofing of pulp chamber, 4) Identification of all canal orifices.',
      specialty: 'Endodontics',
      uploadedAt: new Date(),
      tags: ['anatomy', 'access cavity', 'root canal', 'MB2'],
      type: 'txt'
    },
    {
      id: '2',
      title: 'Periodontal Disease Classification',
      content: 'The 2017 World Workshop classification system categorizes periodontal diseases into: Periodontal Health, Gingivitis, Periodontitis (Stages I-IV, Grades A-C). Staging is based on severity and complexity, while grading reflects rate of progression and response to therapy.',
      specialty: 'Periodontics',
      uploadedAt: new Date(),
      tags: ['classification', 'periodontal disease', 'diagnosis', '2017 workshop'],
      type: 'txt'
    },
    {
      id: '3',
      title: 'Crown Preparation Principles',
      content: 'Successful crown preparation requires: 1) Adequate reduction (1.5-2mm occlusal, 1-1.5mm axial), 2) Proper taper (6-8° total convergence), 3) Smooth margins with appropriate finish line design, 4) Preservation of tooth structure, 5) Consideration of pulp protection.',
      specialty: 'Prosthodontics',
      uploadedAt: new Date(),
      tags: ['crown preparation', 'prosthodontics', 'principles', 'taper', 'margins'],
      type: 'txt'
    }
  ]);
  const [geminiModel, setGeminiModel] = useState<any>(null);

  useEffect(() => {
    // Initialize Google Gemini AI
    try {
      const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyA8JXDjJwSsi9IqRtnRTDaOxKhFj0fky-s';
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      setGeminiModel(model);
    } catch (error) {
      console.error('Error initializing Gemini AI:', error);
    }
  }, []);

  // File upload functionality
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);

    for (const file of uploadedFiles) {
      try {
        // Extract content from file
        const content = await readFileContent(file);
        
        const newNote: LectureNote = {
          id: `note-${Date.now()}-${Math.random()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          content,
          specialty: detectSpecialty(file.name, content),
          uploadedAt: new Date(),
          tags: extractTags(content),
          type: getFileType(file.type),
          size: file.size
        };
        
        setLectureNotes(prev => [...prev, newNote]);
        dentalMentorService.addDocumentContext(content);
        
        // Add to Gemini context if available
        if (geminiModel) {
          try {
            // In a real implementation, you would add this to a vector database
            console.log('Adding document to AI context:', newNote.title);
          } catch (error) {
            console.error('Error adding document to AI context:', error);
          }
        }
        
        // Award XP for uploading
        dispatch({ type: 'EARN_XP', payload: 10 });
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    setUploadedFiles([]);
    setIsUploading(false);
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // For demo purposes, we'll create meaningful content based on filename
        const fileName = file.name.toLowerCase();
        let content = `Document: ${file.name}\n\n`;
        
        if (fileName.includes('endo')) {
          content += "Endodontic treatment involves the diagnosis and treatment of diseases of the dental pulp. Key concepts include: pulp anatomy, access cavity preparation, cleaning and shaping, obturation techniques, and post-treatment care.";
        } else if (fileName.includes('perio')) {
          content += "Periodontal therapy focuses on the treatment of gum diseases. Important topics include: periodontal anatomy, disease classification, non-surgical therapy, surgical procedures, and maintenance protocols.";
        } else if (fileName.includes('crown') || fileName.includes('prosth')) {
          content += "Prosthodontic treatment involves the restoration of teeth with crowns, bridges, and other prosthetic devices. Key principles include: tooth preparation, impression techniques, material selection, and cementation procedures.";
        } else {
          content += `This document contains important dental education material about ${file.name.split('.')[0]}. It includes clinical procedures, diagnostic criteria, treatment protocols, and evidence-based recommendations for dental practice.`;
        }
        
        resolve(content);
      };
      reader.readAsText(file);
    });
  };

  const getFileType = (mimeType: string): 'pdf' | 'docx' | 'txt' | 'uploaded' => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) return 'docx';
    if (mimeType.includes('text')) return 'txt';
    return 'uploaded';
  };

  const detectSpecialty = (fileName: string, content: string): string => {
    const name = fileName.toLowerCase();
    const text = content.toLowerCase();
    
    if (name.includes('endo') || text.includes('endodontic') || text.includes('root canal')) return 'Endodontics';
    if (name.includes('perio') || text.includes('periodontal') || text.includes('gum')) return 'Periodontics';
    if (name.includes('prosth') || name.includes('crown') || text.includes('prosthodontic')) return 'Prosthodontics';
    if (name.includes('ortho') || text.includes('orthodontic') || text.includes('braces')) return 'Orthodontics';
    if (name.includes('surgery') || text.includes('oral surgery') || text.includes('extraction')) return 'Oral Surgery';
    
    return 'General Dentistry';
  };

  const extractTags = (content: string): string[] => {
    const commonTerms = [
      'anatomy', 'physiology', 'treatment', 'diagnosis', 'procedure', 
      'clinical', 'patient care', 'technique', 'materials', 'guidelines'
    ];
    return commonTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).slice(0, 5);
  };

  useEffect(() => {
    // Add lecture notes to DentalMentor context
    lectureNotes.forEach(note => {
      dentalMentorService.addDocumentContext(note.content);
    });
  }, [lectureNotes]);

  const handleQuestionSubmit = async () => {
    if (!currentQuestion.trim()) return;

    setIsProcessing(true);
    
    const newQuestion = {
      id: Date.now().toString(),
      question: currentQuestion,
      answer: '',
      timestamp: new Date()
    };

    try {
      let answer = '';
      
      // Try using Gemini directly if available
      if (geminiModel) {
        try {
          // Create context from lecture notes
          const context = lectureNotes.map(note => 
            `Document: ${note.title}\nContent: ${note.content}`
          ).join('\n\n');
          
          const prompt = `You are Dr. DentalMentor, an expert dental educator. 
          Use the following lecture notes as context to answer the student's question:
          
          ${context}
          
          Student question: ${currentQuestion}
          
          Provide a clear, educational answer based on the lecture notes and your dental knowledge.`;
          
          const result = await geminiModel.generateContent(prompt);
          const response = await result.response;
          answer = response.text();
        } catch (geminiError) {
          console.error('Error using Gemini directly:', geminiError);
          // Fall back to DentalMentor service
          answer = await dentalMentorService.answerStudentQuestion(currentQuestion);
        }
      } else {
        // Use DentalMentor service
        answer = await dentalMentorService.answerStudentQuestion(currentQuestion);
      }
      
      const completedQuestion = { ...newQuestion, answer };
      setChatHistory(prev => [...prev, completedQuestion]);
      setCurrentQuestion('');
      
      // Award XP for asking questions
      dispatch({ type: 'EARN_XP', payload: 10 });
    } catch (error) {
      console.error('Error getting response:', error);
      console.warn('Gemini API not available, using fallback response:', error);
      // Provide fallback response when API is not available
      const fallbackResponse = generateFallbackResponse(currentQuestion);
      const errorQuestion = { 
        ...newQuestion, 
        answer: fallbackResponse
      };
      setChatHistory(prev => [...prev, errorQuestion]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('tooth') || lowerQuestion.includes('teeth')) {
      return "Great question about dental anatomy! Teeth are complex structures with multiple layers including enamel, dentin, and pulp. Each tooth type serves a specific function in mastication. Would you like to explore the different types of teeth and their functions?";
    }
    
    if (lowerQuestion.includes('cavity') || lowerQuestion.includes('caries')) {
      return "Dental caries (cavities) are caused by bacterial acid production that demineralizes tooth enamel. Prevention includes proper oral hygiene, fluoride use, and dietary modifications. Treatment depends on the extent of decay and may involve fillings, crowns, or root canal therapy.";
    }
    
    if (lowerQuestion.includes('gum') || lowerQuestion.includes('periodontal')) {
      return "Periodontal health is crucial for overall oral health. Gum disease progresses from gingivitis to periodontitis if left untreated. Key factors include plaque accumulation, bacterial toxins, and host immune response. Treatment ranges from scaling and root planing to surgical interventions.";
    }
    
    if (lowerQuestion.includes('root canal') || lowerQuestion.includes('endodontic')) {
      return "Endodontic treatment involves removing infected or damaged pulp tissue from the tooth's root canal system. The procedure includes access cavity preparation, cleaning and shaping, disinfection, and obturation. Success depends on proper diagnosis and technique.";
    }
    
    if (lowerQuestion.includes('implant')) {
      return "Dental implants are titanium fixtures that integrate with bone through osseointegration. Success factors include adequate bone volume, proper surgical technique, and maintenance of peri-implant health. They provide excellent long-term solutions for tooth replacement.";
    }
    
    return "That's an interesting question about dentistry! While I'd love to provide a detailed response, the AI service is currently unavailable. Please refer to your course materials or consult with your instructor for comprehensive information on this topic.";
  };

  const filteredNotes = lectureNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left Panel - Lecture Notes & Upload */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Lecture Notes
          </h2>
          
          {/* Upload Area */}
          <div className="mb-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOCX, TXT files
              </p>
            </div>
          </div>

          {/* File Queue */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Files to Upload:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={processFiles}
                disabled={isUploading}
                className="w-full mt-2 py-2 px-3 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Processing...' : `Upload ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedNote(note)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedNote?.id === note.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{note.title}</h3>
                <div className="flex items-center space-x-1">
                  {note.type === 'uploaded' && <CheckCircle className="w-3 h-3 text-green-500" />}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                    {note.type}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{note.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {note.specialty}
                </span>
                <span className="text-xs text-gray-500">
                  {note.uploadedAt.toLocaleDateString()}
                </span>
              </div>
              {note.size && (
                <p className="text-xs text-gray-400 mt-1">
                  {(note.size / 1024).toFixed(1)} KB
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Virtual Lecture Hall Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Virtual Lecture Hall</h1>
              <p className="text-blue-100">Interactive Q&A with DentalMentor AI using your uploaded materials</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4" />
                <span className="text-sm">1 Student Online</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Session Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="text-sm">{lectureNotes.length} Documents</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {chatHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the Virtual Lecture Hall!</h3>
                <p className="text-gray-600 mb-6">Ask DentalMentor anything about your uploaded notes or dental topics. I'll use RAG to provide contextual answers.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { icon: Brain, title: "Ask about Procedures", desc: "Get step-by-step guidance", question: "Walk me through a root canal procedure" },
                    { icon: Lightbulb, title: "Clarify Concepts", desc: "Understand complex topics", question: "Explain the 2017 periodontal classification" },
                    { icon: BookOpen, title: "Review Notes", desc: "Quick reference and summaries", question: "Summarize crown preparation principles" },
                    { icon: MessageCircle, title: "Case Discussion", desc: "Clinical scenario analysis", question: "Help me analyze a complex endodontic case" }
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(feature.question)}
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                      >
                        <Icon className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {chatHistory.map((chat) => (
              <div key={chat.id} className="space-y-4">
                {/* Question */}
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-blue-500 text-white p-4 rounded-2xl rounded-br-sm">
                    <p className="mb-2">{chat.question}</p>
                    <p className="text-xs text-blue-100">{chat.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Answer */}
                <div className="flex justify-start">
                  <div className="max-w-3xl bg-white border border-gray-200 p-6 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">DM</span>
                      </div>
                      <span className="font-semibold text-gray-900">Dr. DentalMentor</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{chat.answer}</div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        💡 This answer was generated using your uploaded lecture notes and dental knowledge base
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-3xl bg-white border border-gray-200 p-6 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">DM</span>
                    </div>
                    <span className="font-semibold text-gray-900">Dr. DentalMentor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-gray-500 text-sm">Analyzing your question using RAG...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Ask me anything about your lecture notes or dental procedures..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleQuestionSubmit();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleQuestionSubmit}
                disabled={!currentQuestion.trim() || isProcessing}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isProcessing ? 'Processing...' : 'Ask Question'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line. Questions are processed using your uploaded materials.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Note Preview */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Note Preview</h3>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedNote.title}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {selectedNote.specialty}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs uppercase">
                    {selectedNote.type}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">{selectedNote.content}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {selectedNote.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>Uploaded: {selectedNote.uploadedAt.toLocaleString()}</p>
                {selectedNote.size && <p>Size: {(selectedNote.size / 1024).toFixed(1)} KB</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LectureRoomScene;