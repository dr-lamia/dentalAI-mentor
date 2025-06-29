import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  content: {
    type: String,
    required: true
  },
  subject: String,
  specialty: {
    type: String,
    enum: ['endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedTime: {
    type: Number,
    default: 15 // in minutes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [String],
  prerequisites: [String],
  learningObjectives: [String],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'pdf', 'link']
    }
  }],
  completions: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
moduleSchema.index({ title: 'text', description: 'text', content: 'text' });
moduleSchema.index({ specialty: 1, difficulty: 1 });
moduleSchema.index({ createdBy: 1 });

export default mongoose.model('Module', moduleSchema);