import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import { authorizeRole } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedName}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, TXT, and image files are allowed.'));
    }
  }
});

// Upload document (teachers only)
router.post('/document', authorizeRole(['teacher', 'admin']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { specialty, tags, subject, isPublic } = req.body;

    // Extract text content (simplified - in production you'd use proper parsers)
    let content = '';
    if (req.file.mimetype === 'text/plain') {
      content = fs.readFileSync(req.file.path, 'utf8');
    } else {
      // For other file types, you'd use appropriate parsers (pdf-parse, mammoth, etc.)
      content = `Document content from ${req.file.originalname}. This would contain the extracted text in a production environment.`;
    }

    // Determine file type
    let fileType = 'txt';
    if (req.file.mimetype.includes('pdf')) fileType = 'pdf';
    else if (req.file.mimetype.includes('word')) fileType = 'docx';
    else if (req.file.mimetype.includes('image')) fileType = 'image';

    const document = new Document({
      name: req.file.originalname,
      originalName: req.file.originalname,
      type: fileType,
      content,
      filePath: req.file.path,
      size: req.file.size,
      uploadedBy: req.user.userId,
      specialty: specialty || 'general',
      subject: subject || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: isPublic === 'true'
    });

    await document.save();

    // Emit to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('document:uploaded', {
        document: await document.populate('uploadedBy', 'name')
      });
    }

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get documents
router.get('/documents', async (req, res) => {
  try {
    const { search, specialty, page = 1, limit = 10 } = req.query;
    
    const filter = {
      $or: [
        { isPublic: true },
        { uploadedBy: req.user.userId }
      ]
    };
    
    if (specialty && specialty !== 'all') {
      filter.specialty = specialty;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    const documents = await Document.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Document.countDocuments(filter);

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download document
router.get('/documents/:id/download', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check access permissions
    if (!document.isPublic && document.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update download count
    document.downloadCount += 1;
    await document.save();

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Send file
    res.download(document.filePath, document.originalName);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
router.delete('/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;