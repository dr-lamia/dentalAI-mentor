import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  score: {
    type: Number,
    default: 0
  }
});

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'study-group', 'lecture', 'case-study'],
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [participantSchema],
  content: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contentModel'
  },
  contentModel: {
    type: String,
    enum: ['Quiz', 'Module', 'CaseStudy']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: 50
  },
  roomId: {
    type: String,
    unique: true,
    required: true
  },
  settings: {
    allowLateJoin: {
      type: Boolean,
      default: true
    },
    showLeaderboard: {
      type: Boolean,
      default: true
    },
    timeLimit: Number
  },
  startedAt: Date,
  endedAt: Date
}, {
  timestamps: true
});

// Index for active sessions
sessionSchema.index({ isActive: 1, createdAt: -1 });
sessionSchema.index({ roomId: 1 });
sessionSchema.index({ host: 1 });

export default mongoose.model('Session', sessionSchema);