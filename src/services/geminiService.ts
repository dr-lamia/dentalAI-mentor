import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, Quiz, Module, CaseStudy } from '../types';

const API_KEY = 'AIzaSyAAaNkc4OOGh1uhnMro1i8xvj20XOWUBJc';
const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  private documentContext: string[] = [];

  // Add document content to context for RAG
  addDocumentContext(content: string) {
    this.documentContext.push(content);
  }

  // Clear document context
  clearContext() {
    this.documentContext = [];
  }

  // Generate a response with document context
  async generateWithContext(prompt: string): Promise<string> {
    const contextPrompt = this.documentContext.length > 0 
      ? `Context from uploaded documents:\n${this.documentContext.join('\n\n')}\n\nUser query: ${prompt}`
      : prompt;

    try {
      const result = await this.model.generateContent(contextPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  // Generate a quiz based on topic and context
  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium', numQuestions: number = 5): Promise<Quiz> {
    const prompt = `Create a ${difficulty} level quiz about "${topic}" with ${numQuestions} multiple choice questions. 
    ${this.documentContext.length > 0 ? 'Use the provided document context as reference material.' : ''}
    
    Format the response as JSON with this structure:
    {
      "title": "Quiz title",
      "description": "Brief description",
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation of correct answer",
          "points": 10
        }
      ]
    }`;

    try {
      const response = await this.generateWithContext(prompt);
      const quizData = JSON.parse(response);
      
      return {
        id: `quiz-${Date.now()}`,
        title: quizData.title,
        description: quizData.description,
        questions: quizData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          type: 'multiple-choice' as const,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty,
          points: q.points || 10
        })),
        subject: topic,
        createdBy: 'EduDash AI',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  // Generate a case study
  async generateCaseStudy(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<CaseStudy> {
    const prompt = `Create a ${difficulty} level case study about "${topic}".
    ${this.documentContext.length > 0 ? 'Use the provided document context as reference material.' : ''}
    
    Format the response as JSON with this structure:
    {
      "title": "Case study title",
      "patientHistory": "Detailed patient history",
      "clinicalFindings": ["Finding 1", "Finding 2", "Finding 3"],
      "questions": [
        {
          "question": "Open-ended question about the case",
          "explanation": "Expected answer or key points",
          "points": 15
        }
      ]
    }`;

    try {
      const response = await this.generateWithContext(prompt);
      const caseData = JSON.parse(response);
      
      return {
        id: `case-${Date.now()}`,
        title: caseData.title,
        patientHistory: caseData.patientHistory,
        clinicalFindings: caseData.clinicalFindings,
        questions: caseData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          type: 'open-ended' as const,
          explanation: q.explanation,
          difficulty,
          points: q.points || 15
        })),
        subject: topic,
        difficulty,
        createdBy: 'EduDash AI',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error generating case study:', error);
      throw new Error('Failed to generate case study');
    }
  }

  // Generate a learning module
  async generateModule(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<Module> {
    const prompt = `Create a comprehensive learning module about "${topic}" at ${difficulty} level.
    ${this.documentContext.length > 0 ? 'Use the provided document context as reference material.' : ''}
    
    Format the response as JSON with this structure:
    {
      "title": "Module title",
      "description": "Brief module description",
      "content": "2-3 paragraphs of educational content explaining the concept in plain language",
      "estimatedTime": 15,
      "questions": [
        {
          "question": "Practice question 1",
          "type": "multiple-choice",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation",
          "points": 10
        }
      ]
    }`;

    try {
      const response = await this.generateWithContext(prompt);
      const moduleData = JSON.parse(response);
      
      return {
        id: `module-${Date.now()}`,
        title: moduleData.title,
        description: moduleData.description,
        content: moduleData.content,
        subject: topic,
        difficulty,
        estimatedTime: moduleData.estimatedTime || 15,
        createdBy: 'EduDash AI',
        createdAt: new Date(),
        questions: moduleData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'medium' as const,
          points: q.points || 10
        }))
      };
    } catch (error) {
      console.error('Error generating module:', error);
      throw new Error('Failed to generate module');
    }
  }

  // Answer student questions
  async answerQuestion(question: string): Promise<string> {
    const prompt = `You are EduDash, a friendly AI teaching assistant. A student has asked: "${question}"
    
    Please provide a clear, supportive answer that:
    1. Defines any technical terms in plain language
    2. Uses step-by-step explanations when appropriate
    3. Is encouraging and educational
    4. Offers to help with related topics
    
    ${this.documentContext.length > 0 ? 'Use the provided document context to give accurate, contextual answers.' : ''}`;

    return await this.generateWithContext(prompt);
  }

  // Evaluate open-ended responses
  async evaluateResponse(question: string, studentResponse: string, expectedAnswer: string): Promise<{ score: number; feedback: string }> {
    const prompt = `Evaluate this student's response to an open-ended question:
    
    Question: ${question}
    Student Response: ${studentResponse}
    Expected Answer/Key Points: ${expectedAnswer}
    
    Provide a score out of 100 and constructive feedback. Format as JSON:
    {
      "score": 85,
      "feedback": "Your response shows good understanding of... Consider also mentioning..."
    }`;

    try {
      const response = await this.generateWithContext(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error evaluating response:', error);
      return {
        score: 50,
        feedback: 'Unable to evaluate response automatically. Please review with your instructor.'
      };
    }
  }
}

export const geminiService = new GeminiService();