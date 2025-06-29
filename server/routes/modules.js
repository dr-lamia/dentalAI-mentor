import express from 'express';
import Joi from 'joi';
import Module from '../models/Module.js';
import User from '../models/User.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const moduleSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000),
  content: Joi.string().required(),
  subject: Joi.string(),
  specialty: Joi.string().valid('endodontics', 'periodontics', 'prosthodontics', 'orthodontics', 'pedodontics', 'oral-surgery', 'oral-medicine', 'radiology', 'public-health'),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
  estimatedTime: Joi.number().min(1).default(15),
  tags: Joi.array().items(Joi.string()),
  prerequisites: Joi.array().items(Joi.string()),
  learningObjectives: Joi.array().items(Joi.string()),
  resources: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    type: Joi.string().valid('video', 'article', 'pdf', 'link').required()
  }))
});

// Get all modules (with filters)
router.get('/', async (req, res) => {
  try {
    const { specialty, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const filter = { isPublished: true };
    
    if (specialty) filter.specialty = specialty;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const modules = await Module.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Module.countDocuments(filter);

    res.json({
      modules,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get module by ID
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('createdBy', 'name');
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Check if user has access (published or created by user)
    if (!module.isPublished && module.createdBy._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ module });
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create module (teachers only)
router.post('/', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = moduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const module = new Module({
      ...value,
      createdBy: req.user.userId
    });

    await module.save();

    // Emit to all connected clients
    req.app.get('io').emit('module:created', {
      module: await module.populate('createdBy', 'name')
    });

    res.status(201).json({
      message: 'Module created successfully',
      module
    });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update module (teachers only)
router.put('/:id', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = moduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && module.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update module
    Object.assign(module, value);
    await module.save();

    res.json({
      message: 'Module updated successfully',
      module
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete module (teachers only)
router.delete('/:id', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && module.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Module.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete module (students)
router.post('/:id/complete', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Award XP based on module difficulty and estimated time
    const xpMultiplier = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2
    };
    
    const baseXP = Math.max(10, module.estimatedTime);
    const xpEarned = Math.round(baseXP * xpMultiplier[module.difficulty]);

    // Update user XP
    const user = await User.findById(req.user.userId);
    const leveledUp = user.addXP(xpEarned);
    await user.save();

    // Update module completion count
    module.completions += 1;
    await module.save();

    // Emit real-time update
    req.app.get('io').emit('module:completed', {
      userId: req.user.userId,
      moduleId: module._id,
      xpEarned,
      leveledUp
    });

    res.json({
      message: 'Module completed successfully',
      xpEarned,
      leveledUp,
      newLevel: user.level,
      totalXP: user.xp
    });
  } catch (error) {
    console.error('Complete module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's module progress
router.get('/user/progress', async (req, res) => {
  try {
    // This would typically be stored in a separate UserProgress model
    // For now, we'll return a simple response
    res.json({
      completedModules: [],
      inProgressModules: [],
      totalModules: await Module.countDocuments({ isPublished: true })
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;