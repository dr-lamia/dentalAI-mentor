import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, X, Loader } from 'lucide-react';
import { aiIntegrationService } from '../../services/aiIntegrationService';
import { useGame } from '../../contexts/GameContext';

interface AIDocumentUploaderProps {
  onTopicAdded: (topic: string) => void;
}

const AIDocumentUploader: React.FC<AIDocumentUploaderProps> = ({ onTopicAdded }) => {
  const { dispatch } = useGame();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<Array<{
    fileName: string;
    success: boolean;
    topic?: string;
    message: string;
  }>>([]);

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

  // Connect to POST /upload and index files in RAG
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    const results: typeof uploadResults = [];

    for (const file of uploadedFiles) {
      try {
        // Use AI Integration Service to upload document
        const result = await aiIntegrationService.uploadDocument(file);
        
        results.push({
          fileName: file.name,
          success: result.success,
          topic: result.topic,
          message: result.message
        });

        // If successful and topic extracted, add to quiz generation dropdown
        if (result.success && result.topic) {
          onTopicAdded(result.topic);
        }

        // Award XP for successful upload
        if (result.success) {
          dispatch({ type: 'EARN_XP', payload: 10 });
        }
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        results.push({
          fileName: file.name,
          success: false,
          message: 'Upload failed'
        });
      }
    }

    setUploadResults(results);
    setUploadedFiles([]);
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload Documents for AI Training'}
        </h3>
        <p className="text-gray-500 mb-4">Drag & drop or click to browse</p>
        <p className="text-sm text-gray-400">
          Supports PDF, DOCX, TXT, and image files
        </p>
      </div>

      {/* File Queue */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Files to Upload</h3>
          <div className="space-y-3 mb-6">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
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
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading & Processing...</span>
              </>
            ) : (
              <span>Upload {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''}</span>
            )}
          </button>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h3>
          <div className="space-y-3">
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{result.fileName}</p>
                    <p className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </p>
                    {result.topic && (
                      <p className="text-xs text-blue-600 mt-1">
                        Topic extracted: {result.topic}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDocumentUploader;