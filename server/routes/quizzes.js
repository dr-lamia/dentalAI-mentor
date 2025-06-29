import express from 'express';
import Joi from 'joi';
import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const quizSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required(),
    type: Joi.string().valid('multiple-choice', 'scenario-based', 'case-study').default('multiple-choice'),
    options: Joi.array().items(Joi.string()).min(2).required(),
    correctAnswer: Joi.number().min(0).required(),
    explanation: Joi.string(),
    specialty: Joi.string().valid('endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health').required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
    points: Joi.number().min(1).default(10),
    imageUrl: Joi.string().uri(),
    xrayUrl: Joi.string().uri()
  })).min(1).required(),
  timeLimit: Joi.number().min(60).default(300),
  subject: Joi.string(),
  specialty: Joi.string().valid('endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health'),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  tags: Joi.array().items(Joi.string())
});

const quizResultSchema = Joi.object({
  quizId: Joi.string().required(),
  answers: Joi.array().items(Joi.object({
    questionId: Joi.string().required(),
    selectedAnswer: Joi.number().required(),
    timeSpent: Joi.number().min(0).required()
  })).required(),
  timeSpent: Joi.number().min(0).required()
});

// Get all quizzes (with filters)
router.get('/', async (req, res) => {
  try {
    const { specialty, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const filter = { isPublished: true };
    
    if (specialty) filter.specialty = specialty;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'createdBy',
        select: 'name'
      }
    };

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Quiz.countDocuments(filter);

    res.json({
      quizzes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if user has access (published or created by user)
    if (!quiz.isPublished && quiz.createdBy._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create quiz (teachers only)
router.post('/', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = quizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add IDs to questions
    value.questions = value.questions.map((q, index) => ({
      ...q,
      id: `q-${index + 1}`
    }));

    const quiz = new Quiz({
      ...value,
      createdBy: req.user.userId
    });

    await quiz.save();

    // Emit to all connected clients
    req.app.get('io').emit('quiz:created', {
      quiz: await quiz.populate('createdBy', 'name')
    });

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update quiz (teachers only)
router.put('/:id', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = quizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update quiz
    Object.assign(quiz, value);
    await quiz.save();

    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete quiz (teachers only)
router.delete('/:id', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', async (req, res) => {
  try {
    const { error, value } = quizResultSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const { answers, timeSpent } = value;

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (question) {
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) {
          correctAnswers++;
          totalPoints += question.points;
        }
        
        processedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          timeSpent: answer.timeSpent
        });
      }
    }

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const xpEarned = totalPoints;

    // Save quiz result
    const quizResult = new QuizResult({
      quiz: quiz._id,
      student: req.user.userId,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent,
      xpEarned,
      answers: processedAnswers
    });

    await quizResult.save();

    // Update user XP and level
    const user = await User.findById(req.user.userId);
    const leveledUp = user.addXP(xpEarned);
    await user.save();

    // Update quiz statistics
    quiz.attempts += 1;
    const allResults = await QuizResult.find({ quiz: quiz._id });
    quiz.averageScore = allResults.reduce((sum, result) => sum + result.score, 0) / allResults.length;
    await quiz.save();

    // Emit real-time update
    req.app.get('io').emit('quiz:completed', {
      userId: req.user.userId,
      quizId: quiz._id,
      score,
      xpEarned,
      leveledUp
    });

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers,
        xpEarned,
        leveledUp,
        timeSpent
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz results for a specific quiz (teachers only)
router.get('/:id/results', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const results = await QuizResult.find({ quiz: req.params.id })
      .populate('student', 'name email')
      .sort({ score: -1, completedAt: -1 });

    res.json({ results });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's quiz history
router.get('/user/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const results = await QuizResult.find({ student: req.user.userId })
      .populate('quiz', 'title subject specialty difficulty')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await QuizResult.countDocuments({ student: req.user.userId });

    res.json({
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;