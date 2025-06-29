import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA8JXDjJwSsi9IqRtnRTDaOxKhFj0fky-s';
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

  // Generate a response with document context using DentalMentor persona
  async generateWithContext(prompt: string): Promise<string> {
    const dentalMentorPrompt = `You are "DentalMentor," an expert AI tutor covering all dental specialties with a lovable, supportive, and professional tone like a favorite university professor. You make complex dental topics fun and engaging.

Your specialties include:
- Endodontics, Periodontics, Prosthodontics, Orthodontics, Pedodontics
- Oral Surgery, Oral Medicine & Pathology, Oral & Maxillofacial Radiology, Dental Public Health

You provide:
- Step-by-step procedure guidance
- Detailed explanations with clinical rationale
- Encouragement and supportive feedback
- Citations to ADA guidelines when relevant
- Common pitfalls and pro tips

${this.documentContext.length > 0 ? `Context from uploaded documents:\n${this.documentContext.join('\n\n')}\n\n` : ''}

Student query: ${prompt}

Respond as DentalMentor with enthusiasm and expertise. Always end with an invitation for follow-up questions.`;

    try {
      const result = await this.model.generateContent(dentalMentorPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('DentalMentor API error:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again, and feel free to ask another question!';
    }
  }

  // Specialized dental procedure guidance
  async getProcedureGuidance(procedure: string, specialty: string): Promise<string> {
    const prompt = `Provide detailed step-by-step guidance for "${procedure}" in ${specialty}. Include:
    1. Patient preparation and anesthesia
    2. Numbered procedural steps
    3. Common pitfalls to avoid
    4. Post-operative care
    5. Success criteria`;

    return await this.generateWithContext(prompt);
  }

  // Case-based diagnosis assistance
  async analyzeClinicalCase(patientHistory: string, clinicalFindings: string[], images?: string[]): Promise<string> {
    const prompt = `Analyze this clinical case:
    
    Patient History: ${patientHistory}
    
    Clinical Findings:
    ${clinicalFindings.map((finding, index) => `${index + 1}. ${finding}`).join('\n')}
    
    Provide:
    1. Differential diagnosis (most likely to least likely)
    2. Additional tests needed
    3. Treatment recommendations
    4. Prognosis
    5. Patient education points`;

    return await this.generateWithContext(prompt);
  }

  // Material selection guidance
  async getMaterialRecommendation(clinicalScenario: string, patientFactors: string[]): Promise<string> {
    const prompt = `Recommend the best dental material for this scenario:
    
    Clinical Scenario: ${clinicalScenario}
    
    Patient Factors:
    ${patientFactors.map((factor, index) => `${index + 1}. ${factor}`).join('\n')}
    
    Compare materials (PFM, Zirconia, Lithium Disilicate, Composite) considering:
    1. Strength and durability
    2. Esthetics
    3. Biocompatibility
    4. Cost-effectiveness
    5. Clinical indications and contraindications`;

    return await this.generateWithContext(prompt);
  }

  // Quiz generation with dental focus
  async generateDentalQuiz(specialty: string, difficulty: 'beginner' | 'intermediate' | 'advanced', numQuestions: number = 5): Promise<any> {
    const prompt = `Create a ${difficulty} level quiz about ${specialty} with ${numQuestions} multiple choice questions.
    
    Focus on:
    - Clinical scenarios and case-based questions
    - Evidence-based treatment decisions
    - Anatomy and physiology relevant to practice
    - Current best practices and guidelines
    
    Format as JSON:
    {
      "title": "Quiz title",
      "description": "Brief description",
      "questions": [
        {
          "question": "Clinical question with scenario",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Detailed explanation with clinical rationale",
          "points": 10,
          "specialty": "${specialty}",
          "difficulty": "${difficulty}"
        }
      ]
    }`;

    try {
      const response = await this.generateWithContext(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating dental quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  // Interactive Q&A for lecture room
  async answerStudentQuestion(question: string): Promise<string> {
    const prompt = `A dental student asks: "${question}"
    
    Provide a comprehensive answer that:
    1. Defines any technical terms clearly
    2. Uses step-by-step explanations
    3. Includes clinical relevance
    4. Mentions current research or guidelines
    5. Encourages further learning
    
    Be enthusiastic and supportive like a favorite professor!`;

    return await this.generateWithContext(prompt);
  }

  // Simulation feedback for dental office scene
  async provideProcedureFeedback(procedure: string, userActions: string[], quality: 'poor' | 'good' | 'excellent'): Promise<string> {
    const prompt = `Provide feedback on this ${procedure} simulation:
    
    User Actions: ${userActions.join(', ')}
    Quality Assessment: ${quality}
    
    Give constructive feedback including:
    1. What was done well
    2. Areas for improvement
    3. Clinical tips for better outcomes
    4. Encouragement for continued practice`;

    return await this.generateWithContext(prompt);
  }
}

export const dentalMentorService = new DentalMentorService();