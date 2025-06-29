import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: String,
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'scenario-based', 'case-study'],
    default: 'multiple-choice'
  },
  options: [String],
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: String,
  specialty: {
    type: String,
    enum: ['endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 10,
    min: 1
  },
  imageUrl: String,
  xrayUrl: String
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 300 // 5 minutes in seconds
  },
  subject: String,
  specialty: {
    type: String,
    enum: ['endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
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
  attempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
quizSchema.index({ title: 'text', description: 'text', subject: 'text' });
quizSchema.index({ specialty: 1, difficulty: 1 });
quizSchema.index({ createdBy: 1 });

export default mongoose.model('Quiz', quizSchema);