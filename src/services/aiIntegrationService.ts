// AI Integration Service - Connects UI to FastAPI endpoints
class AIIntegrationService {
  private baseUrl = import.meta.env.VITE_API_URL || '/api';
  private geminiApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyA8JXDjJwSsi9IqRtnRTDaOxKhFj0fky-s';

  // Chat & Q&A - Hook "Ask Tutor" buttons to POST /ask
  async askTutor(question: string, context?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.geminiApiKey}`
        },
        body: JSON.stringify({
          question,
          context: context || ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.answer || data.response || 'I apologize, but I could not process your question at this time.';
    } catch (error) {
      console.error('Error asking tutor:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }

  // Quiz Generation - Link to GET /generate_quiz?topic={selectedTopic}
  async generateQuiz(topic: string, difficulty: string = 'medium', numQuestions: number = 5): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/generate_quiz?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&num_questions=${numQuestions}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.geminiApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quizData = await response.json();
      
      // Transform to match existing quiz format
      return {
        id: `quiz-${Date.now()}`,
        title: quizData.title || `${topic} Quiz`,
        description: quizData.description || `Test your knowledge on ${topic}`,
        questions: quizData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          type: 'multiple-choice' as const,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          specialty: topic.toLowerCase().replace(/\s+/g, '-'),
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
          points: q.points || 10
        })),
        subject: topic,
        createdBy: 'AI Generated',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  // Case Study Generation - Link to GET /generate_case?topic={selectedTopic}
  async generateCaseStudy(topic: string, difficulty: string = 'medium'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/generate_case?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.geminiApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const caseData = await response.json();
      
      // Transform to match existing case study format
      return {
        id: `case-${Date.now()}`,
        title: caseData.title || `${topic} Case Study`,
        patientHistory: caseData.patientHistory || caseData.patient_history,
        clinicalFindings: caseData.clinicalFindings || caseData.clinical_findings || [],
        labResults: caseData.labResults || caseData.lab_results || [],
        images: caseData.images || [],
        xrays: caseData.xrays || [],
        questions: caseData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          type: 'open-ended' as const,
          explanation: q.explanation || q.expected_answer,
          specialty: topic.toLowerCase().replace(/\s+/g, '-'),
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
          points: q.points || 15
        })),
        specialty: topic.toLowerCase().replace(/\s+/g, '-'),
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      };
    } catch (error) {
      console.error('Error generating case study:', error);
      throw new Error('Failed to generate case study');
    }
  }

  // Answer Validation - Connect to POST /validate_answer
  async validateAnswer(questionId: string, answer: number | string, studentId: string): Promise<{isCorrect: boolean, score: number, feedback: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/validate_answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.geminiApiKey}`
        },
        body: JSON.stringify({
          questionId,
          answer,
          studentId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        isCorrect: data.isCorrect || data.is_correct,
        score: data.score || (data.isCorrect ? 1 : -1),
        feedback: data.feedback || 'Answer processed'
      };
    } catch (error) {
      console.error('Error validating answer:', error);
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Error validating answer'
      };
    }
  }

  // Tooth Preparation Analysis - Map to POST /analyze_prep
  async analyzePreparation(meshData: any, measurements: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze_prep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.geminiApiKey}`
        },
        body: JSON.stringify({
          meshData,
          measurements
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.feedback || data.analysis || 'Analysis completed';
    } catch (error) {
      console.error('Error analyzing preparation:', error);
      return 'Error analyzing preparation. Please try again.';
    }
  }

  // Material Recommendation - Wire to GET /recommend_material?caseId={caseId}
  async recommendMaterial(caseId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/recommend_material?caseId=${encodeURIComponent(caseId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.geminiApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting material recommendation:', error);
      throw new Error('Failed to get material recommendation');
    }
  }

  // Design Review - Bind to POST /review_design
  async reviewDesign(designData: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/review_design`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.geminiApiKey}`
        },
        body: JSON.stringify(designData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.feedback || data.review || 'Design review completed';
    } catch (error) {
      console.error('Error reviewing design:', error);
      return 'Error reviewing design. Please try again.';
    }
  }

  // Document Upload - Connect to POST /upload
  async uploadDocument(file: File): Promise<{success: boolean, topic?: string, message: string}> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.geminiApiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        topic: data.topic || data.extracted_topic,
        message: data.message || 'Document uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        message: 'Failed to upload document'
      };
    }
  }
}

export const aiIntegrationService = new AIIntegrationService();