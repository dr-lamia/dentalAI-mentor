import express from 'express';
import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';

const router = express.Router();

// Get global leaderboard
router.get('/', async (req, res) => {
  try {
    const { timeframe = 'all-time', limit = 50 } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case 'weekly':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'monthly':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'all-time':
      default:
        // No date filter for all-time
        break;
    }

    // Get top users by total points
    const users = await User.find({ isActive: true, ...dateFilter })
      .select('name level xp totalPoints badges currentStreak studyTime')
      .sort({ totalPoints: -1, xp: -1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      user: {
        id: user._id,
        name: user.name,
        level: user.level,
        xp: user.xp,
        totalPoints: user.totalPoints,
        badges: user.badges,
        currentStreak: user.currentStreak,
        studyTime: user.studyTime
      },
      points: user.totalPoints
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz-specific leaderboard
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const results = await QuizResult.find({ quiz: req.params.quizId })
      .populate('student', 'name level')
      .sort({ score: -1, completedAt: 1 })
      .limit(parseInt(limit));

    const leaderboard = results.map((result, index) => ({
      rank: index + 1,
      user: {
        id: result.student._id,
        name: result.student.name,
        level: result.student.level
      },
      score: result.score,
      timeSpent: result.timeSpent,
      completedAt: result.completedAt
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get quiz leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's rank
router.get('/user/rank', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count users with higher total points
    const higherRankedCount = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints },
      isActive: true
    });

    const rank = higherRankedCount + 1;

    // Update user's global rank
    user.globalRank = rank;
    await user.save();

    res.json({ 
      rank,
      totalPoints: user.totalPoints,
      level: user.level,
      xp: user.xp
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalQuizzes = await QuizResult.countDocuments();
    
    const topPerformer = await User.findOne({ isActive: true })
      .sort({ totalPoints: -1 })
      .select('name totalPoints level');

    const averageScore = await QuizResult.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          totalAttempts: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalQuizzes,
      topPerformer,
      averageScore: averageScore[0]?.avgScore || 0,
      totalAttempts: averageScore[0]?.totalAttempts || 0
    });
  } catch (error) {
    console.error('Get leaderboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;