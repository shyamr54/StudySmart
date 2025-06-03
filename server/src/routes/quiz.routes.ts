import express from 'express';
import { generateQuiz, getQuiz, submitQuizAnswers } from '../controllers/quiz.controller';

const router = express.Router();

// Generate a new quiz from note content
router.post('/generate', generateQuiz);

// Get a specific quiz by ID
router.get('/:id', getQuiz);

// Submit answers for a quiz
router.post('/:id/submit', submitQuizAnswers);

export default router; 