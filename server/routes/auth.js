import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Create demo accounts on server start
const createDemoAccounts = async () => {
  try {
    // Check if demo accounts already exist
    const studentExists = await User.findOne({ email: 'student@demo.com' });
    const teacherExists = await User.findOne({ email: 'teacher@demo.com' });

    if (!studentExists) {
      const demoStudent = new User({
        name: 'Demo Student',
        email: 'student@demo.com',
        password: 'password123',
        role: 'student',
        level: 3,
        xp: 1250,
        totalPoints: 1450,
        currentStreak: 7,
        studyTime: 24,
        globalRank: 47,
        badges: [
          {
            id: '1',
            name: 'First Steps',
            description: 'Completed first quiz',
            icon: '🎯',
            rarity: 'common',
            color: 'text-blue-500'
          }
        ]
      });
      await demoStudent.save();
      console.log('✅ Demo student account created');
    }

    if (!teacherExists) {
      const demoTeacher = new User({
        name: 'Dr. Demo Teacher',
        email: 'teacher@demo.com',
        password: 'password123',
        role: 'teacher',
        level: 10,
        xp: 5000,
        totalPoints: 8500,
        currentStreak: 15,
        studyTime: 120,
        globalRank: 5,
        badges: [
          {
            id: '1',
            name: 'Educator',
            description: 'Created first learning module',
            icon: '🎓',
            rarity: 'epic',
            color: 'text-purple-500'
          }
        ]
      });
      await demoTeacher.save();
      console.log('✅ Demo teacher account created');
    }
  } catch (error) {
    console.error('Error creating demo accounts:', error);
  }
};

// Initialize demo accounts
createDemoAccounts();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { email: req.body.email, role: req.body.role });
    
    const { name, email, password, role = 'student' } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: role || 'student'
    });

    await user.save();
    console.log('✅ User created successfully:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      badges: user.badges,
      currentStreak: user.currentStreak,
      studyTime: user.studyTime,
      globalRank: user.globalRank
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      badges: user.badges,
      currentStreak: user.currentStreak,
      studyTime: user.studyTime,
      globalRank: user.globalRank
    };

    console.log('✅ Login successful:', email);
    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;