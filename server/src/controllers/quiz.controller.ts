import { Request, Response } from 'express';
import { Quiz, QuizQuestion } from '../models/Quiz';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { noteContent, numQuestions = 5 } = req.body;

    if (!noteContent) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const prompt = `Generate ${numQuestions} multiple choice questions based on the following content. 
    For each question, provide 4 options and indicate the correct answer. 
    Also provide a brief explanation for the correct answer.
    Format the response as JSON with the following structure:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": number (0-3),
          "explanation": "string"
        }
      ]
    }
    
    Content: ${noteContent}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    const quiz: Quiz = {
      id: uuidv4(),
      title: `Quiz from Note - ${new Date().toLocaleDateString()}`,
      questions: response.questions,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: req.user?.id || 'anonymous',
      sourceNoteId: req.body.noteId,
    };

    // Store quiz in database (implement your storage logic here)
    // For now, we'll just return the generated quiz
    return res.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implement quiz retrieval logic
    // For now, return a mock response
    return res.json({ message: 'Quiz retrieval not implemented yet' });
  } catch (error) {
    console.error('Error getting quiz:', error);
    return res.status(500).json({ error: 'Failed to get quiz' });
  }
};

export const submitQuizAnswers = async (req: Request, res: Response) => {
  try {
    const { quizId, answers } = req.body;
    
    // Implement answer submission and scoring logic
    // For now, return a mock response
    return res.json({ message: 'Quiz submission not implemented yet' });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return res.status(500).json({ error: 'Failed to submit quiz answers' });
  }
}; 