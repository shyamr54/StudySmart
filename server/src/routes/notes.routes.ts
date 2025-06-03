import express, { Router, ErrorRequestHandler } from 'express';
import multer from 'multer';
import * as notesController from '../controllers/notes.controller';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists with proper permissions
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
  console.log('Created uploads directory:', uploadsDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a safe filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept pdf files only
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB max file size
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
export const handleMulterError: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Multer error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  } else if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  next();
};

const router: Router = express.Router();

// Define routes
router.post('/upload', upload.single('pdf'), notesController.uploadPdf);
router.post('/extract', notesController.extractText);
router.post('/generate-summary', notesController.generateNoteSummary);
router.get('/user/:userId', notesController.getUserNotes);
router.get('/:noteId', notesController.getNoteById);
router.post('/save', notesController.saveNote);
router.delete('/:id', notesController.deleteNote);
router.patch('/:id', notesController.updateNote);

export default router;