import express from 'express';
import Joi from 'joi';
import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';

const router = express.Router();

// Validation schemas
const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  preferences: Joi.object({
    notifications: Joi.boolean(),
    theme: Joi.string().valid('light', 'dark')
  })
});

const xpSchema = Joi.object({
  amount: Joi.number().required()
});

const badgeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  icon: Joi.string().required(),
  rarity: Joi.string().valid('common', 'rare', 'epic', 'legendary').default('common'),
  color: Joi.string().required()
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { error, value } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (value.name) user.name = value.name;
    if (value.preferences) {
      user.preferences = { ...user.preferences, ...value.preferences };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get quiz statistics
    const quizResults = await QuizResult.find({ student: req.user.userId });
    const totalQuizzes = quizResults.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes > 0 
      ? Math.max(...quizResults.map(r => r.score))
      : 0;

    // Calculate rank
    const higherRankedCount = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints },
      isActive: true
    });
    const rank = higherRankedCount + 1;

    const stats = {
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      globalRank: rank,
      badges: user.badges.length,
      currentStreak: user.currentStreak,
      studyTime: user.studyTime,
      quizStats: {
        totalQuizzes,
        averageScore,
        bestScore
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add XP to user
router.post('/xp', async (req, res) => {
  try {
    const { error, value } = xpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const leveledUp = user.addXP(value.amount);
    await user.save();

    // Emit real-time update
    req.app.get('io').notifyUser(req.user.userId, 'xp:earned', {
      amount: value.amount,
      newXP: user.xp,
      newLevel: user.level,
      leveledUp
    });

    res.json({
      message: 'XP added successfully',
      xpEarned: value.amount,
      newXP: user.xp,
      newLevel: user.level,
      leveledUp
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add badge to user
router.post('/badges', async (req, res) => {
  try {
    const { error, value } = badgeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const badge = {
      id: `badge-${Date.now()}`,
      ...value,
      earnedAt: new Date()
    };

    const badgeAdded = user.addBadge(badge);
    if (!badgeAdded) {
      return res.status(400).json({ error: 'Badge already exists' });
    }

    await user.save();

    // Emit real-time update
    req.app.get('io').notifyUser(req.user.userId, 'badge:earned', { badge });

    res.json({
      message: 'Badge added successfully',
      badge
    });
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's badges
router.get('/badges', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('badges');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ badges: user.badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update study time
router.post('/study-time', async (req, res) => {
  try {
    const { minutes } = req.body;
    
    if (typeof minutes !== 'number' || minutes < 0) {
      return res.status(400).json({ error: 'Invalid study time' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.studyTime += minutes;
    await user.save();

    res.json({
      message: 'Study time updated',
      totalStudyTime: user.studyTime
    });
  } catch (error) {
    console.error('Update study time error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;