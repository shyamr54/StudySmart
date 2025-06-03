/**
 * API client for StudySmartBuddy
 * Handles all API communication with the backend server
 */

// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || response.statusText;
    throw new Error(error);
  }
  
  return data;
}

// API client object with methods for different endpoints
export const api = {
  // Notes endpoints
  async getAllNotes(userId = 'test-user-123') {
    try {
      const response = await fetch(`${API_URL}/notes?userId=${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes. Please try again later.');
    }
  },
  
  // Used in components for getting user notes
  async getUserNotes(userId = 'test-user-123') {
    try {
      const response = await fetch(`${API_URL}/notes/user/${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching user notes:', error);
      throw new Error('Failed to fetch user notes. Please try again later.');
    }
  },
  
  async getNoteById(id: string) {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching note:', error);
      throw new Error('Failed to fetch note. Please try again later.');
    }
  },
  
  async saveNote(noteData: any) {
    try {
      const response = await fetch(`${API_URL}/notes/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error saving note:', error);
      throw new Error('Failed to save note. Please try again later.');
    }
  },
  
  // Update note endpoint
  async updateNote(noteData: { _id: string; title: string; summary: string }) {
    try {
      const response = await fetch(`${API_URL}/notes/${noteData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteData.title,
          summary: noteData.summary
        }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note. Please try again later.');
    }
  },
  
  // Delete note endpoint
  async deleteNote(noteId: string) {
    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note. Please try again later.');
    }
  },
  
  // Flashcard endpoints
  async getFlashcards(noteId: string) {
    const response = await fetch(`${API_URL}/flashcards?noteId=${noteId}`);
    return handleResponse(response);
  },
  
  // New method to get all flashcards for a user, grouped by notes
  async getAllUserFlashcards(userId = 'test-user-123') {
    try {
      const response = await fetch(`${API_URL}/flashcards/user/${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching user flashcards:", error);
      
      // Fallback implementation if API call fails
      return {
        success: true,
        message: "Flashcards retrieved from fallback",
        flashcardGroups: []
      };
    }
  },
  
  // Used in components for saving flashcards
  async saveFlashcards(data: {
    userId: string;
    noteId: string;
    flashcards: Array<{ question: string; answer: string }>;
  }) {
    const response = await fetch(`${API_URL}/flashcards/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  async generateFlashcards(text: string) {
    const response = await fetch(`${API_URL}/flashcards/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
  
  // PDF processing endpoints
  async uploadPDF(file: File) {
    try {
      if (!file) {
        throw new Error('No file selected');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('pdf', file);
      
      console.log('Uploading PDF:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const response = await fetch(`${API_URL}/notes/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to upload PDF: ${error.message}`);
      }
      throw new Error('Failed to upload PDF. Please try again later.');
    }
  },
  
  async extractText(filePath: string) {
    const response = await fetch(`${API_URL}/notes/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath }),
    });
    return handleResponse(response);
  },
  
  async generateSummary(text: string, title: string) {
    const response = await fetch(`${API_URL}/notes/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, title }),
    });
    return handleResponse(response);
  },
  
  // Export endpoints
  async exportToMarkdown(noteId: string) {
    const response = await fetch(`${API_URL}/export/markdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noteId }),
    });
    return handleResponse(response);
  },
  
  async exportToAnki(noteId: string) {
    const response = await fetch(`${API_URL}/export/anki`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noteId }),
    });
    return handleResponse(response);
  },
};
