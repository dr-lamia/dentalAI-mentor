import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiIntegrationService } from './aiIntegrationService';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyA8JXDjJwSsi9IqRtnRTDaOxKhFj0fky-s';
const genAI = new GoogleGenerativeAI(API_KEY);

class DentalMentorService {
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

  // Use AI Integration Service for student questions
  async answerStudentQuestion(question: string): Promise<string> {
    try {
      // Use the AI Integration Service which calls the FastAPI endpoint
      return await aiIntegrationService.askTutor(question, this.documentContext.join('\n\n'));
    } catch (error) {
      console.error('Error in DentalMentor service:', error);
      return 'I apologize, but I encountered an error processing your question. Please try again!';
    }
  }

  // Generate quiz using AI Integration Service
  async generateDentalQuiz(specialty: string, difficulty: 'beginner' | 'intermediate' | 'advanced', numQuestions: number = 5): Promise<any> {
    try {
      return await aiIntegrationService.generateQuiz(specialty, difficulty, numQuestions);
    } catch (error) {
      console.error('Error generating dental quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  // Generate case study using AI Integration Service
  async generateCaseStudy(specialty: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<any> {
    try {
      return await aiIntegrationService.generateCaseStudy(specialty, difficulty);
    } catch (error) {
      console.error('Error generating case study:', error);
      throw new Error('Failed to generate case study');
    }
  }

  // Provide procedure feedback using AI Integration Service
  async provideProcedureFeedback(procedure: string, userActions: string[], quality: 'poor' | 'good' | 'excellent'): Promise<string> {
    try {
      const analysisData = {
        procedure,
        userActions,
        quality,
        timestamp: new Date().toISOString()
      };
      
      return await aiIntegrationService.analyzePreparation(analysisData, {});
    } catch (error) {
      console.error('Error providing procedure feedback:', error);
      return 'Unable to provide feedback at this time. Please try again.';
    }
  }

  // Get material recommendation using AI Integration Service
  async getMaterialRecommendation(clinicalScenario: string, patientFactors: string[]): Promise<string> {
    try {
      const caseId = `case-${Date.now()}`;
      const recommendation = await aiIntegrationService.recommendMaterial(caseId);
      return recommendation.recommendation || 'Material recommendation generated successfully.';
    } catch (error) {
      console.error('Error getting material recommendation:', error);
      return 'Unable to provide material recommendation at this time.';
    }
  }

  // Review design using AI Integration Service
  async reviewDesign(designData: any): Promise<string> {
    try {
      return await aiIntegrationService.reviewDesign(designData);
    } catch (error) {
      console.error('Error reviewing design:', error);
      return 'Unable to review design at this time. Please try again.';
    }
  }
}

export const dentalMentorService = new DentalMentorService();