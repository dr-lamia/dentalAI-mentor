import express from 'express';
import Joi from 'joi';
import Session from '../models/Session.js';
import { authorizeRole } from '../middleware/auth.js';
import { generateRoomId } from '../utils/helpers.js';

const router = express.Router();

// Validation schemas
const sessionSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  type: Joi.string().valid('quiz', 'study-group', 'lecture', 'case-study').required(),
  content: Joi.string(), // ObjectId of Quiz, Module, or CaseStudy
  contentModel: Joi.string().valid('Quiz', 'Module', 'CaseStudy'),
  maxParticipants: Joi.number().min(1).max(100).default(50),
  settings: Joi.object({
    allowLateJoin: Joi.boolean().default(true),
    showLeaderboard: Joi.boolean().default(true),
    timeLimit: Joi.number().min(60)
  })
});

// Get all active sessions
router.get('/', async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    const filter = { isActive: true };
    if (type) filter.type = type;

    const sessions = await Session.find(filter)
      .populate('host', 'name')
      .populate('participants.user', 'name')
      .populate('content')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Session.countDocuments(filter);

    res.json({
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get session by room ID
router.get('/room/:roomId', async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId })
      .populate('host', 'name')
      .populate('participants.user', 'name level xp')
      .populate('content');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create session (teachers only)
router.post('/', authorizeRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const roomId = generateRoomId();

    const session = new Session({
      ...value,
      host: req.user.userId,
      roomId,
      participants: [{
        user: req.user.userId,
        isActive: true,
        score: 0
      }]
    });

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('host', 'name')
      .populate('participants.user', 'name')
      .populate('content');

    // Emit to all connected clients
    req.app.get('io').emit('session:created', {
      session: populatedSession
    });

    res.status(201).json({
      message: 'Session created successfully',
      session: populatedSession
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join session
router.post('/:roomId/join', async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.isActive) {
      return res.status(400).json({ error: 'Session is not active' });
    }

    // Check if already joined
    const existingParticipant = session.participants.find(
      p => p.user.toString() === req.user.userId
    );

    if (existingParticipant) {
      existingParticipant.isActive = true;
    } else {
      // Check max participants
      if (session.participants.length >= session.maxParticipants) {
        return res.status(400).json({ error: 'Session is full' });
      }

      session.participants.push({
        user: req.user.userId,
        isActive: true,
        score: 0
      });
    }

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('host', 'name')
      .populate('participants.user', 'name level xp')
      .populate('content');

    // Emit real-time update
    req.app.get('io').to(req.params.roomId).emit('session:participant-joined', {
      session: populatedSession,
      participant: {
        user: {
          _id: req.user.userId,
          name: req.user.name
        }
      }
    });

    res.json({
      message: 'Joined session successfully',
      session: populatedSession
    });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave session
router.post('/:roomId/leave', async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participant = session.participants.find(
      p => p.user.toString() === req.user.userId
    );

    if (participant) {
      participant.isActive = false;
    }

    await session.save();

    // Emit real-time update
    req.app.get('io').to(req.params.roomId).emit('session:participant-left', {
      userId: req.user.userId
    });

    res.json({ message: 'Left session successfully' });
  } catch (error) {
    console.error('Leave session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// End session (host only)
router.post('/:roomId/end', async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is host
    if (session.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the host can end the session' });
    }

    session.isActive = false;
    session.endedAt = new Date();
    await session.save();

    // Emit real-time update
    req.app.get('io').to(req.params.roomId).emit('session:ended', {
      sessionId: session._id
    });

    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update participant score (for real-time scoring)
router.post('/:roomId/score', async (req, res) => {
  try {
    const { score } = req.body;
    
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: 'Invalid score' });
    }

    const session = await Session.findOne({ roomId: req.params.roomId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participant = session.participants.find(
      p => p.user.toString() === req.user.userId
    );

    if (!participant) {
      return res.status(404).json({ error: 'Not a participant in this session' });
    }

    participant.score = score;
    await session.save();

    // Emit real-time leaderboard update
    const leaderboard = session.participants
      .filter(p => p.isActive)
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        rank: index + 1,
        user: p.user,
        score: p.score
      }));

    req.app.get('io').to(req.params.roomId).emit('session:leaderboard-update', {
      leaderboard
    });

    res.json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Update score error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;