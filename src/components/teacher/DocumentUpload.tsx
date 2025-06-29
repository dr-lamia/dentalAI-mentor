import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, CheckCircle, X, Tag } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { geminiService } from '../../services/geminiService';
import { Document } from '../../types';

const DocumentUpload: React.FC = () => {
  const { state, dispatch } = useApp();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
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
        // Simulate file content extraction (in real app, you'd use proper parsers)
        const content = await readFileContent(file);
        
        const document: Document = {
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: getFileType(file.type),
          content,
          uploadedAt: new Date(),
          uploadedBy: state.currentUser?.id || 'unknown',
          tags: extractTags(content),
          subject: 'General'
        };

        // Add to context and state
        geminiService.addDocumentContext(content);
        dispatch({ type: 'ADD_DOCUMENT', payload: document });

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    setUploadedFiles([]);
    setIsProcessing(false);
    setCurrentFile('');
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // For demo purposes, we'll use the filename and some mock content
        resolve(`Document: ${file.name}\n\nContent: This is a sample document about ${file.name.split('.')[0]}. It contains educational material that can be used to generate quizzes, case studies, and learning modules.`);
      };
      reader.readAsText(file);
    });
  };

  const getFileType = (mimeType: string): 'pdf' | 'docx' | 'txt' | 'image' => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('wordprocessingml')) return 'docx';
    if (mimeType.includes('image')) return 'image';
    return 'txt';
  };

  const extractTags = (content: string): string[] => {
    // Simple tag extraction based on common educational terms
    const commonTerms = ['anatomy', 'physiology', 'treatment', 'diagnosis', 'procedure', 'case study', 'clinical'];
    return commonTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).slice(0, 5);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600">Upload lecture notes, slides, and educational materials to power AI-generated content</p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-gray-500 mb-4">or click to browse</p>
        <p className="text-sm text-gray-400">
          Supports PDF, DOCX, TXT, and image files
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Files to Upload</h3>
            <div className="space-y-3">
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
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
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

            <div className="mt-6 flex justify-end">
              <button
                onClick={processFiles}
                disabled={isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Upload ${uploadedFiles.length} File${uploadedFiles.length > 1 ? 's' : ''}`}
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

      {/* Uploaded Documents */}
      {state.documents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {doc.type.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{doc.name}</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Uploaded {doc.uploadedAt.toLocaleDateString()}
                </p>
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;