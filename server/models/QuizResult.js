import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: String,
  selectedAnswer: Number,
  isCorrect: Boolean,
  timeSpent: Number // in seconds
});

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true // in seconds
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  answers: [answerSchema],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for leaderboard queries
quizResultSchema.index({ score: -1, completedAt: -1 });
quizResultSchema.index({ student: 1, quiz: 1 });
quizResultSchema.index({ quiz: 1, score: -1 });

export default mongoose.model('QuizResult', quizResultSchema);