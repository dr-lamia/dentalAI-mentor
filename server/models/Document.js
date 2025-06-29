import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: String,
  type: {
    type: String,
    enum: ['pdf', 'docx', 'txt', 'image'],
    required: true
  },
  content: String, // Extracted text content
  filePath: String, // Path to uploaded file
  size: Number, // File size in bytes
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  subject: String,
  specialty: {
    type: String,
    enum: ['endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health', 'general']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
documentSchema.index({ name: 'text', content: 'text', tags: 'text' });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ specialty: 1 });

export default mongoose.model('Document', documentSchema);