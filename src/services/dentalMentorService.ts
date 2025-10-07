import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiIntegrationService } from './aiIntegrationService';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyAAaNkc4OOGh1uhnMro1i8xvj20XOWUBJc';
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
      // First try using the AI Integration Service which calls the FastAPI endpoint
      return await aiIntegrationService.askTutor(question, this.documentContext.join('\n\n'));
    } catch (error) {
      console.error('Error in DentalMentor service:', error);
      
      // Fallback to direct Gemini API call if the service fails
      try {
        console.log('Falling back to direct Gemini API call');
        const contextPrompt = this.documentContext.length > 0 
          ? `Context from uploaded documents:\n${this.documentContext.join('\n\n')}\n\nStudent question: ${question}`
          : `Student question: ${question}`;
          
        const fullPrompt = `You are Dr. DentalMentor, an expert in dental education. Please answer the following question in a clear, educational manner:
        
        ${contextPrompt}
        
        Provide a comprehensive but concise answer that would be helpful for a dental student.`;
        
        const result = await this.model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
      } catch (secondError) {
        console.error('Fallback to Gemini API also failed:', secondError);
        return 'I apologize, but I encountered an error processing your question. Please try again!';
      }
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

  // Generate learning module
  async generateModule(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<any> {
    try {
      // Try using AI Integration Service first
      return await aiIntegrationService.generateModule(topic, difficulty);
    } catch (error) {
      console.error('Error generating module via service:', error);
      
      // Fallback to direct Gemini API call
      try {
        console.log('Falling back to direct Gemini API call for module generation');
        const contextPrompt = this.documentContext.length > 0 
          ? `Context from uploaded documents:\n${this.documentContext.join('\n\n')}\n\n`
          : '';
          
        const fullPrompt = `You are Dr. DentalMentor, an expert in dental education. Please create a comprehensive learning module about "${topic}" at ${difficulty} level.
        
        ${contextPrompt}
        
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
          ],
          "specialty": "endodontics",
          "difficulty": "${difficulty}"
        }`;
        
        const result = await this.model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to generate valid module data');
        }
        
        return JSON.parse(jsonMatch[0]);
      } catch (secondError) {
        console.error('Fallback to Gemini API also failed for module generation:', secondError);
        
        // Return a basic module structure as last resort
        return {
          title: `${topic} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`,
          description: `Learning module about ${topic}`,
          content: `This is a learning module about ${topic}. The content would typically include detailed information about this dental topic.`,
          estimatedTime: 30,
          questions: [
            {
              question: `What is a key principle of ${topic}?`,
              type: "multiple-choice",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              explanation: "This would explain the correct answer",
              points: 10
            }
          ],
          specialty: "general",
          difficulty: difficulty
        };
      }
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