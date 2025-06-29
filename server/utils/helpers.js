import crypto from 'crypto';
import fs from 'fs';

// Generate unique room ID for sessions
export const generateRoomId = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Generate unique file name
export const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
};

// Calculate user level from XP
export const calculateLevel = (xp) => {
  return Math.floor(xp / 500) + 1;
};

// Calculate XP needed for next level
export const xpToNextLevel = (currentXp) => {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelXp = currentLevel * 500;
  return nextLevelXp - currentXp;
};

// Validate file type
export const isValidFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Sanitize filename
export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

// Generate badge based on achievement
export const generateBadge = (type, data) => {
  const badges = {
    'first_quiz': {
      name: 'First Steps',
      description: 'Completed your first quiz',
      icon: '🎯',
      rarity: 'common',
      color: 'text-blue-500'
    },
    'perfect_score': {
      name: 'Perfectionist',
      description: 'Achieved 100% on a quiz',
      icon: '⭐',
      rarity: 'rare',
      color: 'text-yellow-500'
    },
    'speed_demon': {
      name: 'Speed Demon',
      description: 'Completed quiz in record time',
      icon: '⚡',
      rarity: 'rare',
      color: 'text-purple-500'
    },
    'study_streak': {
      name: 'Dedicated Learner',
      description: `${data.days} day study streak`,
      icon: '🔥',
      rarity: data.days >= 30 ? 'epic' : 'common',
      color: 'text-orange-500'
    },
    'level_up': {
      name: 'Level Master',
      description: `Reached level ${data.level}`,
      icon: '🏆',
      rarity: data.level >= 10 ? 'epic' : 'common',
      color: 'text-green-500'
    }
  };

  const badge = badges[type];
  if (!badge) return null;

  return {
    id: `${type}-${Date.now()}`,
    ...badge,
    earnedAt: new Date()
  };
};

// Calculate quiz statistics
export const calculateQuizStats = (results) => {
  if (!results.length) return null;

  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const averageScore = totalScore / results.length;
  const bestScore = Math.max(...results.map(r => r.score));
  const totalTime = results.reduce((sum, result) => sum + result.timeSpent, 0);
  const averageTime = totalTime / results.length;

  return {
    totalAttempts: results.length,
    averageScore: Math.round(averageScore),
    bestScore,
    totalTime,
    averageTime: Math.round(averageTime)
  };
};

// Validate quiz data
export const validateQuizData = (quiz) => {
  const errors = [];

  if (!quiz.title || quiz.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }

  quiz.questions?.forEach((question, index) => {
    if (!question.question || question.question.trim().length < 5) {
      errors.push(`Question ${index + 1}: Question text must be at least 5 characters long`);
    }

    if (!question.options || question.options.length < 2) {
      errors.push(`Question ${index + 1}: Must have at least 2 options`);
    }

    if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer >= question.options?.length) {
      errors.push(`Question ${index + 1}: Invalid correct answer index`);
    }
  });

  return errors;
};

// Ensure directory exists
export const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};