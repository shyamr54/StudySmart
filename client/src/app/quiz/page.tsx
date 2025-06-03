'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteContent: 'Your note content here', // This should come from your notes
          numQuestions: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuiz(data);
      setSelectedAnswers(new Array(data.questions.length).fill(-1));
      setShowResults(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (selectedAnswers.includes(-1)) {
      toast({
        title: 'Warning',
        description: 'Please answer all questions before submitting.',
        variant: 'destructive',
      });
      return;
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Quiz Generator</h1>
      
      {!quiz ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generate a Quiz</h2>
          <p className="mb-4">Generate a quiz from your notes to test your knowledge.</p>
          <Button onClick={generateQuiz} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Quiz'}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{quiz.title}</h2>
            {!showResults && (
              <Button onClick={submitQuiz}>
                Submit Quiz
              </Button>
            )}
          </div>

          {quiz.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {questionIndex + 1}. {question.question}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-lg cursor-pointer ${
                      showResults
                        ? optionIndex === question.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : selectedAnswers[questionIndex] === optionIndex
                          ? 'bg-red-100 border-red-500'
                          : 'bg-gray-50'
                        : selectedAnswers[questionIndex] === optionIndex
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-gray-50'
                    } border-2`}
                    onClick={() => !showResults && handleAnswerSelect(questionIndex, optionIndex)}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {showResults && question.explanation && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{question.explanation}</p>
                </div>
              )}
            </Card>
          ))}

          {showResults && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
              <p className="text-lg">
                Score: {calculateScore()} out of {quiz.questions.length}
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setQuiz(null);
                  setSelectedAnswers([]);
                  setShowResults(false);
                }}
              >
                Generate New Quiz
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 