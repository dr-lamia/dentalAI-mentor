import mongoose from 'mongoose';

const caseQuestionSchema = new mongoose.Schema({
  id: String,
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'open-ended'],
    default: 'multiple-choice'
  },
  options: [String],
  correctAnswer: Number,
  explanation: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 15
  }
});

const caseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  patientHistory: {
    type: String,
    required: true
  },
  clinicalFindings: [String],
  labResults: [String],
  images: [String],
  xrays: [String],
  questions: [caseQuestionSchema],
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
caseStudySchema.index({ title: 'text', patientHistory: 'text' });
caseStudySchema.index({ specialty: 1, difficulty: 1 });
caseStudySchema.index({ createdBy: 1 });

export default mongoose.model('CaseStudy', caseStudySchema);