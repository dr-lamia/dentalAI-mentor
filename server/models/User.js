import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const badgeSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  color: String
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [badgeSchema],
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  studyTime: {
    type: Number,
    default: 0,
    min: 0
  },
  globalRank: {
    type: Number,
    default: null
  },
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update level based on XP
userSchema.methods.updateLevel = function() {
  const newLevel = Math.floor(this.xp / 500) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
    return true; // Level up occurred
  }
  return false;
};

// Add XP and update level
userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  this.totalPoints += amount;
  return this.updateLevel();
};

// Add badge
userSchema.methods.addBadge = function(badge) {
  // Check if badge already exists
  const existingBadge = this.badges.find(b => b.name === badge.name);
  if (!existingBadge) {
    this.badges.push(badge);
    return true;
  }
  return false;
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);