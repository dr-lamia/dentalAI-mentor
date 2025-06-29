import express from 'express';
import Joi from 'joi';
import CaseStudy from '../models/CaseStudy.js';
import User from '../models/User.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const caseStudySchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  patientHistory: Joi.string().required(),
  clinicalFindings: Joi.array().items(Joi.string()).min(1).required(),
  labResults: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string().uri()),
  xrays: Joi.array().items(Joi.string().uri()),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required(),
    type: Joi.string().valid('multiple-choice', 'open-ended').default('multiple-choice'),
    options: Joi.array().items(Joi.string()),
    correctAnswer: Joi.number(),
    explanation: Joi.string(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
    points: Joi.number().min(1).default(15)
  })).min(1).required(),
  specialty: Joi.string().valid('endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health').required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  tags: Joi.array().items(Joi.string())
});

const caseResponseSchema = Joi.object({
  responses: Joi.array().items(Joi.object({
    questionId: Joi.string().required(),
    response: Joi.alternatives().try(Joi.string(), Joi.number()).required()
  })).required()
});

// Get all case studies (with filters)
router.get('/', async (req, res) => {
  try {
    const { specialty, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const filter = { isPublished: true };
    
    if (specialty) filter.specialty = specialty;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const caseStudies = await CaseStudy.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await CaseStudy.countDocuments(filter);

    res.json({
      caseStudies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get case studies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case study by ID
router.get('/:id', async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id).populate('createdBy', 'name');
    
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    // Check if user has access (published or created by user)
    if (!caseStudy.isPublished && caseStudy.createdBy._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ caseStudy });
  } catch (error) {
    console.error('Get case study error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create case study (teachers only)
router.post('/', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = caseStudySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add IDs to questions
    value.questions = value.questions.map((q, index) => ({
      ...q,
      id: `q-${index + 1}`
    }));

    const caseStudy = new CaseStudy({
      ...value,
      createdBy: req.user.userId
    });

    await caseStudy.save();

    // Emit to all connected clients
    req.app.get('io').emit('case-study:created', {
      caseStudy: await caseStudy.populate('createdBy', 'name')
    });

    res.status(201).json({
      message: 'Case study created successfully',
      caseStudy
    });
  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update case study (teachers only)
router.put('/:id', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = caseStudySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && caseStudy.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update case study
    Object.assign(caseStudy, value);
    await caseStudy.save();

    res.json({
      message: 'Case study updated successfully',
      caseStudy
    });
  } catch (error) {
    console.error('Update case study error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete case study (teachers only)
router.delete('/:id', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && caseStudy.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await CaseStudy.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Case study deleted successfully' });
  } catch (error) {
    console.error('Delete case study error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit case study responses
router.post('/:id/submit', async (req, res) => {
  try {
    const { error, value } = caseResponseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    const { responses } = value;

    // Calculate score for multiple choice questions
    let totalPoints = 0;
    let earnedPoints = 0;
    const processedResponses = [];

    for (const response of responses) {
      const question = caseStudy.questions.find(q => q.id === response.questionId);
      if (question) {
        totalPoints += question.points;
        
        let isCorrect = false;
        if (question.type === 'multiple-choice' && question.correctAnswer !== undefined) {
          isCorrect = response.response === question.correctAnswer;
          if (isCorrect) {
            earnedPoints += question.points;
          }
        } else {
          // For open-ended questions, award partial points (would need AI evaluation in production)
          earnedPoints += Math.round(question.points * 0.7); // 70% for attempting
        }
        
        processedResponses.push({
          questionId: response.questionId,
          response: response.response,
          isCorrect,
          points: isCorrect ? question.points : 0
        });
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    // Update user XP
    const user = await User.findById(req.user.userId);
    const leveledUp = user.addXP(earnedPoints);
    await user.save();

    // Update case study statistics
    caseStudy.attempts += 1;
    // Note: In production, you'd store individual results and calculate average
    await caseStudy.save();

    // Emit real-time update
    req.app.get('io').emit('case-study:completed', {
      userId: req.user.userId,
      caseStudyId: caseStudy._id,
      score,
      xpEarned: earnedPoints,
      leveledUp
    });

    res.json({
      message: 'Case study submitted successfully',
      result: {
        score,
        totalPoints,
        earnedPoints,
        responses: processedResponses,
        xpEarned: earnedPoints,
        leveledUp
      }
    });
  } catch (error) {
    console.error('Submit case study error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case study results (teachers only)
router.get('/:id/results', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && caseStudy.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // In production, you'd have a separate CaseStudyResult model
    // For now, return basic statistics
    res.json({
      results: [],
      statistics: {
        totalAttempts: caseStudy.attempts,
        averageScore: caseStudy.averageScore
      }
    });
  } catch (error) {
    console.error('Get case study results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;