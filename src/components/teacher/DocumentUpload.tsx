import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, CheckCircle, X, Tag, Download, Eye, Edit, Trash2, Search, Filter, Plus, FileUp } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'image';
  size: number;
  uploadedAt: Date;
  tags: string[];
  description: string;
  downloads: number;
  thumbnail?: string;
}

const DocumentUpload: React.FC = () => {
  const { state, dispatch } = useGame();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Document | null>(null);
  
  // New resource form state
  const [newResource, setNewResource] = useState<Partial<Document>>({
    name: '',
    type: 'pdf',
    description: '',
    tags: []
  });
  
  // Mock documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Root Canal Therapy Guide',
      type: 'pdf',
      size: 2.4 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['endodontics', 'procedure', 'guide'],
      description: 'Comprehensive guide to root canal therapy including step-by-step procedures and troubleshooting tips.',
      downloads: 18,
      thumbnail: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '2',
      name: 'Crown Preparation Checklist',
      type: 'docx',
      size: 1.1 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ['prosthodontics', 'crown', 'preparation'],
      description: 'Detailed checklist for crown preparation procedures to ensure optimal results.',
      downloads: 24,
      thumbnail: 'https://images.pexels.com/photos/3845743/pexels-photo-3845743.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '3',
      name: 'Periodontal Disease Classification',
      type: 'pdf',
      size: 3.8 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ['periodontics', 'classification', 'diagnosis'],
      description: 'Updated classification of periodontal diseases based on the latest research and clinical guidelines.',
      downloads: 12,
      thumbnail: 'https://images.pexels.com/photos/3845757/pexels-photo-3845757.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '4',
      name: 'Dental Implant Placement Protocol',
      type: 'pdf',
      size: 5.2 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      tags: ['implantology', 'surgical', 'protocol'],
      description: 'Surgical protocol for dental implant placement with considerations for different clinical scenarios.',
      downloads: 31,
      thumbnail: 'https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]);

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
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);

    for (const file of uploadedFiles) {
      setCurrentFile(file.name);
      
      try {
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add to documents
        const newDoc: Document = {
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: getFileType(file.type),
          size: file.size,
          uploadedAt: new Date(),
          tags: generateTags(file.name),
          description: `Educational resource about ${file.name.split('.')[0].replace(/[-_]/g, ' ')}`,
          downloads: 0,
          thumbnail: getRandomThumbnail()
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        // Award XP for uploading
        dispatch({ type: 'EARN_XP', payload: 10 });
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    setUploadedFiles([]);
    setIsProcessing(false);
    setCurrentFile('');
  };

  const getFileType = (mimeType: string): 'pdf' | 'docx' | 'txt' | 'image' => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) return 'docx';
    if (mimeType.includes('text')) return 'txt';
    return 'image';
  };

  const generateTags = (fileName: string): string[] => {
    const name = fileName.toLowerCase();
    const tags = [];
    
    if (name.includes('endo')) tags.push('endodontics');
    if (name.includes('perio')) tags.push('periodontics');
    if (name.includes('crown') || name.includes('prosth')) tags.push('prosthodontics');
    if (name.includes('ortho')) tags.push('orthodontics');
    if (name.includes('surg')) tags.push('oral-surgery');
    if (name.includes('guide') || name.includes('protocol')) tags.push('procedure');
    if (name.includes('check')) tags.push('checklist');
    
    // Add at least one tag if none were generated
    if (tags.length === 0) {
      tags.push('educational');
    }
    
    return tags;
  };

  const getRandomThumbnail = (): string => {
    const thumbnails = [
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/3845743/pexels-photo-3845743.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/3845757/pexels-photo-3845757.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=150'
    ];
    return thumbnails[Math.floor(Math.random() * thumbnails.length)];
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleCreateResource = () => {
    if (!newResource.name) return;
    
    const resource: Document = {
      id: `doc-${Date.now()}`,
      name: newResource.name,
      type: newResource.type as 'pdf' | 'docx' | 'txt' | 'image',
      size: 1024 * 1024, // Default 1MB
      uploadedAt: new Date(),
      tags: newResource.tags || [],
      description: newResource.description || '',
      downloads: 0,
      thumbnail: getRandomThumbnail()
    };
    
    setDocuments(prev => [...prev, resource]);
    setShowResourceModal(false);
    setNewResource({
      name: '',
      type: 'pdf',
      description: '',
      tags: []
    });
  };

  const handleUpdateResource = () => {
    if (!editingResource) return;
    
    setDocuments(prev => prev.map(doc => 
      doc.id === editingResource.id ? editingResource : doc
    ));
    
    setEditingResource(null);
  };

  const handleAddTag = (tag: string) => {
    if (editingResource) {
      if (!editingResource.tags.includes(tag)) {
        setEditingResource({...editingResource, tags: [...editingResource.tags, tag]});
      }
    } else {
      if (!newResource.tags?.includes(tag)) {
        setNewResource({...newResource, tags: [...(newResource.tags || []), tag]});
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (editingResource) {
      setEditingResource({...editingResource, tags: editingResource.tags.filter(t => t !== tag)});
    } else {
      setNewResource({...newResource, tags: newResource.tags?.filter(t => t !== tag)});
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-gray-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Resources</h2>
          <p className="text-gray-600">Manage educational materials for your students</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowResourceModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Resource</span>
          </button>
          <button
            onClick={() => document.getElementById('fileUpload')?.click()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </button>
          <input 
            id="fileUpload" 
            type="file" 
            multiple 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files) {
                setUploadedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
              }
            }}
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-gray-500 mb-4">or click to browse</p>
        <p className="text-sm text-gray-400">
          Supports PDF, DOCX, TXT, and image files
        </p>
      </div>

      {/* File Queue */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Files to Upload</h3>
            <div className="space-y-3 mb-6">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {file.type.includes('image') ? (
                        <Image className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={processFiles}
                disabled={isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Upload {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Status */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <div>
                <p className="font-medium text-blue-900">Processing Documents</p>
                <p className="text-sm text-blue-700">Currently processing: {currentFile}</p>
              </div>
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
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="docx">Word Documents</option>
              <option value="txt">Text Files</option>
              <option value="image">Images</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">All Resources</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Uploaded</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tags</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {doc.thumbnail ? (
                          <img src={doc.thumbnail} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          getFileIcon(doc.type)
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{doc.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs uppercase">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {formatFileSize(doc.size)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {doc.uploadedAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {doc.downloads}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{doc.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingResource(doc)}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or upload new resources</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowResourceModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Resource
              </button>
              <button
                onClick={() => document.getElementById('fileUpload')?.click()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Upload Files
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Resource Modal */}
      <AnimatePresence>
        {(showResourceModal || editingResource) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowResourceModal(false);
              setEditingResource(null);
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
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <button
                  onClick={() => {
                    setShowResourceModal(false);
                    setEditingResource(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Name
                  </label>
                  <input
                    type="text"
                    value={editingResource?.name || newResource.name}
                    onChange={(e) => {
                      if (editingResource) {
                        setEditingResource({...editingResource, name: e.target.value});
                      } else {
                        setNewResource({...newResource, name: e.target.value});
                      }
                    }}
                    placeholder="Enter resource name"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type & Thumbnail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Type
                    </label>
                    <select
                      value={editingResource?.type || newResource.type}
                      onChange={(e) => {
                        const value = e.target.value as Document['type'];
                        if (editingResource) {
                          setEditingResource({...editingResource, type: value});
                        } else {
                          setNewResource({...newResource, type: value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="docx">Word Document</option>
                      <option value="txt">Text File</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingResource?.thumbnail || newResource.thumbnail || ''}
                      onChange={(e) => {
                        if (editingResource) {
                          setEditingResource({...editingResource, thumbnail: e.target.value});
                        } else {
                          setNewResource({...newResource, thumbnail: e.target.value});
                        }
                      }}
                      placeholder="Enter thumbnail URL"
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
                    value={editingResource?.description || newResource.description}
                    onChange={(e) => {
                      if (editingResource) {
                        setEditingResource({...editingResource, description: e.target.value});
                      } else {
                        setNewResource({...newResource, description: e.target.value});
                      }
                    }}
                    placeholder="Enter resource description"
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editingResource?.tags || newResource.tags || []).map((tag, index) => (
                      <div key={index} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-700 hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add a tag"
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleAddTag(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        if (input.value.trim()) {
                          handleAddTag(input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'oral-surgery', 'procedure', 'guide', 'checklist'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowResourceModal(false);
                      setEditingResource(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingResource ? handleUpdateResource : handleCreateResource}
                    disabled={!(editingResource?.name || newResource.name)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingResource ? 'Update Resource' : 'Add Resource'}
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

export default DocumentUpload;