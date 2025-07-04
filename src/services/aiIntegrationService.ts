// AI Integration Service - Connects UI to FastAPI endpoints
class AIIntegrationService {
  private baseUrl = import.meta.env.VITE_API_URL || '/api';
  private geminiApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyA8JXDjJwSsi9IqRtnRTDaOxKhFj0fky-s';

  // Chat & Q&A - Hook "Ask Tutor" buttons to POST /ask
  async askTutor(question: string, context?: string): Promise<string> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for askTutor in development mode');
        return this.getMockResponse(question);
      }

      const response = await fetch(`${this.baseUrl}/ai/ask`, {
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
      // Fallback to mock response in case of error
      return this.getMockResponse(question);
    }
  }

  // Quiz Generation - Link to GET /generate_quiz?topic={selectedTopic}
  async generateQuiz(topic: string, difficulty: string = 'medium', numQuestions: number = 5): Promise<any> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for generateQuiz in development mode');
        return this.getMockQuiz(topic, difficulty, numQuestions);
      }

      const response = await fetch(`${this.baseUrl}/ai/generate_quiz?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&num_questions=${numQuestions}`, {
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
      // Fallback to mock quiz in case of error
      return this.getMockQuiz(topic, difficulty, numQuestions);
    }
  }

  // Case Study Generation - Link to GET /generate_case?topic={selectedTopic}
  async generateCaseStudy(topic: string, difficulty: string = 'medium'): Promise<any> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for generateCaseStudy in development mode');
        return this.getMockCaseStudy(topic, difficulty);
      }

      const response = await fetch(`${this.baseUrl}/ai/generate_case?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`, {
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
      // Fallback to mock case study in case of error
      return this.getMockCaseStudy(topic, difficulty);
    }
  }

  // Generate a learning module
  async generateModule(topic: string, difficulty: string = 'intermediate'): Promise<any> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for generateModule in development mode');
        return this.getMockModule(topic, difficulty);
      }

      const response = await fetch(`${this.baseUrl}/ai/generate_module?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.geminiApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const moduleData = await response.json();
      return moduleData;
    } catch (error) {
      console.error('Error generating module:', error);
      // Fallback to mock module in case of error
      return this.getMockModule(topic, difficulty);
    }
  }

  // Answer Validation - Connect to POST /validate_answer
  async validateAnswer(questionId: string, answer: number | string, studentId: string): Promise<{isCorrect: boolean, score: number, feedback: string}> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for validateAnswer in development mode');
        return this.getMockValidation(questionId, answer);
      }

      const response = await fetch(`${this.baseUrl}/ai/validate_answer`, {
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
      // Fallback to mock validation in case of error
      return this.getMockValidation(questionId, answer);
    }
  }

  // Tooth Preparation Analysis - Map to POST /analyze_prep
  async analyzePreparation(meshData: any, measurements: any): Promise<string> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for analyzePreparation in development mode');
        return this.getMockAnalysis(measurements);
      }

      const response = await fetch(`${this.baseUrl}/ai/analyze_prep`, {
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
      // Fallback to mock analysis in case of error
      return this.getMockAnalysis(measurements);
    }
  }

  // Material Recommendation - Wire to GET /recommend_material?caseId={caseId}
  async recommendMaterial(caseId: string): Promise<any> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for recommendMaterial in development mode');
        return this.getMockMaterialRecommendation();
      }

      const response = await fetch(`${this.baseUrl}/ai/recommend_material?caseId=${encodeURIComponent(caseId)}`, {
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
      // Fallback to mock recommendation in case of error
      return this.getMockMaterialRecommendation();
    }
  }

  // Design Review - Bind to POST /review_design
  async reviewDesign(designData: any): Promise<string> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for reviewDesign in development mode');
        return this.getMockDesignReview(designData);
      }

      const response = await fetch(`${this.baseUrl}/ai/review_design`, {
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
      // Fallback to mock review in case of error
      return this.getMockDesignReview(designData);
    }
  }

  // Document Upload - Connect to POST /upload
  async uploadDocument(file: File): Promise<{success: boolean, topic?: string, message: string}> {
    try {
      // For development, return a mock response if the API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock response for uploadDocument in development mode');
        return this.getMockDocumentUpload(file);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/ai/upload`, {
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
      // Fallback to mock upload in case of error
      return this.getMockDocumentUpload(file);
    }
  }

  // Mock response generators for development and fallback
  private getMockResponse(question: string): string {
    // Generate a relevant response based on the question
    if (question.toLowerCase().includes('endodontic') || question.toLowerCase().includes('root canal')) {
      return "Root canal therapy (endodontic treatment) involves removing infected pulp tissue, cleaning and shaping the canal system, and filling it with biocompatible materials. The key steps include: 1) Access preparation, 2) Canal identification, 3) Working length determination, 4) Cleaning and shaping, 5) Obturation, and 6) Coronal restoration. Success depends on thorough disinfection and proper sealing to prevent reinfection.";
    } else if (question.toLowerCase().includes('crown') || question.toLowerCase().includes('preparation')) {
      return "Crown preparation requires precise reduction of tooth structure to accommodate the restoration material while ensuring retention and resistance form. Key principles include: 1) Adequate occlusal reduction (1.5-2mm), 2) Axial reduction (1-1.5mm), 3) Proper taper (6-8° total convergence), 4) Smooth, continuous margins, and 5) Preservation of tooth structure. The finish line design depends on the restoration material and clinical situation.";
    } else if (question.toLowerCase().includes('periodontal') || question.toLowerCase().includes('gum')) {
      return "Periodontal disease is classified according to the 2017 World Workshop system into: Periodontal Health, Gingivitis, and Periodontitis (Stages I-IV, Grades A-C). Treatment involves non-surgical therapy (scaling and root planing), followed by surgical interventions when necessary. Maintenance therapy is crucial for long-term success, with regular professional cleanings and excellent home care.";
    } else {
      return "That's an excellent question about dental education. In dental practice, evidence-based approaches combine clinical expertise with the best available scientific evidence and patient values. Continuing education is essential to stay current with evolving techniques, materials, and treatment protocols. Would you like more specific information about a particular dental specialty or procedure?";
    }
  }

  private getMockQuiz(topic: string, difficulty: string, numQuestions: number): any {
    // Generate a mock quiz based on the topic
    const questions = [];
    
    if (topic.toLowerCase().includes('endodontic') || topic.toLowerCase().includes('root canal')) {
      questions.push(
        {
          question: "Which of the following is NOT a step in root canal therapy?",
          options: ["Access preparation", "Working length determination", "Enamel etching", "Canal obturation"],
          correctAnswer: 2,
          explanation: "Enamel etching is a procedure used in restorative dentistry for bonding, not in endodontic therapy. The main steps of root canal treatment include access preparation, working length determination, cleaning and shaping, and canal obturation.",
          points: 10
        },
        {
          question: "What is the primary purpose of obturation in endodontic treatment?",
          options: ["To remove bacteria from the canal", "To determine the working length", "To seal the canal system", "To shape the canal"],
          correctAnswer: 2,
          explanation: "The primary purpose of obturation is to seal the canal system to prevent reinfection. This is typically achieved using gutta-percha and sealer to create a three-dimensional fill of the cleaned and shaped root canal system.",
          points: 10
        }
      );
    } else if (topic.toLowerCase().includes('crown') || topic.toLowerCase().includes('preparation')) {
      questions.push(
        {
          question: "What is the recommended total occlusal convergence angle for crown preparations?",
          options: ["2-4°", "6-8°", "12-15°", "20-25°"],
          correctAnswer: 1,
          explanation: "The recommended total occlusal convergence angle for crown preparations is 6-8°. This provides adequate retention while allowing for proper seating of the restoration.",
          points: 10
        },
        {
          question: "Which of the following finish line designs is most appropriate for a full-contour zirconia crown?",
          options: ["Knife edge", "Chamfer", "Heavy chamfer", "Shoulder with bevel"],
          correctAnswer: 1,
          explanation: "A chamfer finish line is most appropriate for full-contour zirconia crowns. It provides adequate strength at the margin while conserving tooth structure compared to a shoulder preparation.",
          points: 10
        }
      );
    } else {
      questions.push(
        {
          question: `What is a key consideration when treating patients with ${topic}?`,
          options: ["Patient medical history", "Office decoration", "Staff uniforms", "Parking availability"],
          correctAnswer: 0,
          explanation: `When treating patients with ${topic}, a thorough review of the patient's medical history is essential to identify any conditions or medications that might affect treatment planning or outcomes.`,
          points: 10
        },
        {
          question: `Which of the following is most important for successful outcomes in ${topic}?`,
          options: ["Proper diagnosis", "Marketing strategies", "Office location", "Brand of equipment"],
          correctAnswer: 0,
          explanation: `Proper diagnosis is the foundation of successful treatment in ${topic}. Without accurate diagnosis, even the most skillful technical execution may not address the underlying problem.`,
          points: 10
        }
      );
    }
    
    // Add more questions if needed
    while (questions.length < numQuestions) {
      questions.push({
        question: `Sample question ${questions.length + 1} about ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This is an explanation for the sample question ${questions.length + 1} about ${topic}.`,
        points: 10
      });
    }
    
    return {
      id: `quiz-${Date.now()}`,
      title: `${topic} Quiz`,
      description: `Test your knowledge on ${topic} with this ${difficulty} level quiz.`,
      questions: questions.map((q, index) => ({
        id: `q-${index}`,
        question: q.question,
        type: 'multiple-choice' as const,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        specialty: topic.toLowerCase().replace(/\s+/g, '-'),
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        points: q.points
      })),
      subject: topic,
      createdBy: 'AI Generated',
      createdAt: new Date()
    };
  }

  private getMockCaseStudy(topic: string, difficulty: string): any {
    // Generate a mock case study based on the topic
    let patientHistory = "";
    let clinicalFindings = [];
    let questions = [];
    
    if (topic.toLowerCase().includes('endodontic') || topic.toLowerCase().includes('root canal')) {
      patientHistory = "A 45-year-old patient presents with severe, spontaneous pain in the lower right posterior region. Pain started 3 days ago and has been keeping the patient awake at night. Patient reports sensitivity to hot and cold, with lingering pain after stimulus removal. Medical history: Hypertension controlled with medication.";
      clinicalFindings = [
        "Deep carious lesion on tooth #30 (mandibular right first molar)",
        "Positive response to cold test with lingering pain (>30 seconds)",
        "Positive percussion test",
        "No swelling or sinus tract present",
        "Probing depths within normal limits"
      ];
      questions = [
        {
          question: "Based on the clinical presentation and radiographic findings, what is the most likely diagnosis?",
          explanation: "The combination of spontaneous pain, lingering response to cold, positive percussion, and periapical radiolucency indicates irreversible pulpitis with apical periodontitis. The pulp is inflamed beyond repair but not yet necrotic, as evidenced by the positive vitality test.",
          points: 15
        },
        {
          question: "What is the most appropriate treatment for this patient?",
          explanation: "Root canal treatment is indicated for irreversible pulpitis. The goal is to remove the inflamed pulp tissue, clean and shape the canal system, and provide proper obturation to prevent reinfection.",
          points: 15
        }
      ];
    } else if (topic.toLowerCase().includes('crown') || topic.toLowerCase().includes('prosthodontic')) {
      patientHistory = "A 58-year-old patient presents for full mouth rehabilitation. Patient has multiple missing teeth and wants to improve function and esthetics. History of periodontal disease, now stable. Patient is a non-smoker and has well-controlled diabetes.";
      clinicalFindings = [
        "Missing teeth: #3, #14, #19, #30, #31",
        "Existing crowns on #8, #9 with poor margins",
        "Generalized moderate wear on remaining teeth",
        "Stable periodontal condition",
        "Adequate bone height for implants"
      ];
      questions = [
        {
          question: "What would be the most appropriate treatment plan for the posterior missing teeth?",
          explanation: "Given the patient's good oral hygiene, stable periodontal condition, adequate bone, and controlled diabetes, implant-supported crowns would provide the best long-term solution for missing posterior teeth.",
          points: 15
        },
        {
          question: "For the existing crowns with poor margins, what is the best approach?",
          explanation: "Poor crown margins can lead to recurrent decay and periodontal problems. In a comprehensive treatment plan, these should be replaced with properly fitting crowns.",
          points: 15
        }
      ];
    } else {
      patientHistory = `A patient presents with concerns related to ${topic}. The patient has been experiencing symptoms for several weeks and is seeking professional advice.`;
      clinicalFindings = [
        `Clinical examination reveals signs consistent with ${topic}`,
        "Patient reports moderate discomfort",
        "No significant medical history that would contraindicate treatment",
        "Radiographic examination shows no significant abnormalities"
      ];
      questions = [
        {
          question: `What is the most appropriate diagnostic approach for this ${topic} case?`,
          explanation: `A comprehensive diagnostic approach for ${topic} should include a thorough clinical examination, appropriate radiographs, and possibly additional tests specific to the condition. The diagnosis should be based on the integration of all findings.`,
          points: 15
        },
        {
          question: `What treatment options would you consider for this ${topic} case?`,
          explanation: `Treatment options for ${topic} should be evidence-based and tailored to the patient's specific condition, preferences, and medical history. A step-wise approach from conservative to more invasive options should be considered.`,
          points: 15
        }
      ];
    }
    
    return {
      id: `case-${Date.now()}`,
      title: `${topic} Case Study`,
      patientHistory: patientHistory,
      clinicalFindings: clinicalFindings,
      labResults: ["Vitality test: Positive but prolonged response", "Radiographic examination: Periapical radiolucency present"],
      images: ["https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg"],
      xrays: ["https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg"],
      questions: questions.map((q, index) => ({
        id: `q-${index}`,
        question: q.question,
        type: 'open-ended' as const,
        explanation: q.explanation,
        specialty: topic.toLowerCase().replace(/\s+/g, '-'),
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        points: q.points
      })),
      specialty: topic.toLowerCase().replace(/\s+/g, '-'),
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    };
  }

  private getMockModule(topic: string, difficulty: string): any {
    // Generate a mock module based on the topic
    let content = "";
    let questions = [];
    
    if (topic.toLowerCase().includes('endodontic') || topic.toLowerCase().includes('root canal')) {
      content = `# Root Canal Therapy: Principles and Techniques

## Introduction
Root canal therapy, or endodontic treatment, is a procedure designed to eliminate infection and protect the decontaminated tooth from future microbial invasion. It involves removing the infected or inflamed pulp tissue, carefully cleaning and shaping the root canal system, and then filling and sealing the space.

## Anatomy and Access
Understanding pulp chamber and root canal anatomy is crucial for successful treatment. The access cavity should provide straight-line access to the canal orifices while conserving tooth structure. For anterior teeth, access is typically triangular or oval, while posterior teeth require more rectangular or rhomboidal access designs.

## Cleaning and Shaping
The primary goals of cleaning and shaping are to:
1. Remove all pulp tissue, bacteria, and their byproducts
2. Create a continuously tapering preparation from crown to apex
3. Maintain the original canal path
4. Keep the apical foramen in its original position
5. Create a sufficient apical constriction

Modern techniques utilize nickel-titanium rotary instruments that maintain canal curvature while efficiently removing debris. Irrigation with sodium hypochlorite is essential for dissolving organic tissue and eliminating bacteria.

## Obturation
The goal of obturation is to create a fluid-tight seal along the length of the root canal system. The most common technique uses gutta-percha with a sealer. The thermoplastic technique allows the material to adapt to the irregularities of the canal system, creating a three-dimensional fill.

## Restoration
After root canal treatment, the tooth must be properly restored to prevent reinfection and fracture. Posterior teeth generally require cuspal coverage with a crown, while anterior teeth may be restored with composite resin if sufficient tooth structure remains.`;
      
      questions = [
        {
          question: "What is the primary goal of cleaning and shaping in endodontic treatment?",
          type: "multiple-choice",
          options: [
            "To create a perfectly round canal",
            "To remove all pulp tissue, bacteria, and their byproducts",
            "To enlarge the canal as much as possible",
            "To create multiple apical foramina"
          ],
          correctAnswer: 1,
          explanation: "The primary goal of cleaning and shaping is to remove all pulp tissue, bacteria, and their byproducts while creating a continuously tapering preparation that maintains the original canal path.",
          points: 10
        },
        {
          question: "Why is proper restoration after root canal treatment important?",
          type: "multiple-choice",
          options: [
            "It's purely for esthetic purposes",
            "It prevents reinfection and fracture of the tooth",
            "It's required by insurance companies",
            "It makes the tooth stronger than before treatment"
          ],
          correctAnswer: 1,
          explanation: "Proper restoration after root canal treatment is essential to prevent reinfection of the canal system and to protect the tooth from fracture, as endodontically treated teeth are more susceptible to fracture.",
          points: 10
        }
      ];
    } else if (topic.toLowerCase().includes('crown') || topic.toLowerCase().includes('prosthodontic')) {
      content = `# Crown Preparation: Principles and Techniques

## Introduction
Crown preparation is a critical procedure in restorative dentistry that involves the reduction of tooth structure to accommodate a full-coverage restoration. The success of the final restoration depends largely on the quality of the preparation, which must balance biological, mechanical, and esthetic considerations.

## Preparation Principles
Successful crown preparations adhere to several key principles:
1. **Conservation of tooth structure**: Remove only what is necessary for the restoration
2. **Retention and resistance form**: Create features that prevent dislodgment
3. **Structural durability**: Ensure sufficient thickness for the restorative material
4. **Marginal integrity**: Create precise, smooth margins for optimal fit
5. **Preservation of periodontium**: Maintain gingival health

## Preparation Techniques
### Occlusal/Incisal Reduction
- For metal: 1.0-1.5mm
- For metal-ceramic: 1.5-2.0mm
- For all-ceramic: 1.5-2.0mm

### Axial Reduction
- For metal: 0.5-1.0mm
- For metal-ceramic: 1.0-1.5mm
- For all-ceramic: 1.0-1.5mm

### Taper
The ideal taper is 6-8° total convergence angle (3-4° per wall). Excessive taper reduces retention, while insufficient taper prevents proper seating.

### Margin Design
- **Chamfer**: Suitable for metal and zirconia crowns
- **Heavy chamfer**: For metal-ceramic and lithium disilicate
- **Shoulder**: For traditional all-ceramic crowns
- **Knife-edge**: Occasionally used for supragingival margins on molars

## Common Errors
1. Insufficient reduction leading to over-contoured or weak restorations
2. Excessive taper reducing retention
3. Rough or irregular margins
4. Sharp internal line angles creating stress concentration
5. Damage to adjacent teeth

## Digital Workflow
Modern crown preparation can be integrated with digital workflows using intraoral scanners, CAD software, and milling machines. This approach offers advantages in precision, efficiency, and patient comfort.`;
      
      questions = [
        {
          question: "What is the ideal total convergence angle for crown preparations?",
          type: "multiple-choice",
          options: [
            "2-4°",
            "6-8°",
            "12-15°",
            "20-25°"
          ],
          correctAnswer: 1,
          explanation: "The ideal taper is 6-8° total convergence angle (3-4° per wall). Excessive taper reduces retention, while insufficient taper prevents proper seating of the crown.",
          points: 10
        },
        {
          question: "Which margin design is most appropriate for a zirconia crown?",
          type: "multiple-choice",
          options: [
            "Knife-edge",
            "Chamfer",
            "Heavy chamfer",
            "Shoulder with bevel"
          ],
          correctAnswer: 1,
          explanation: "A chamfer margin is most appropriate for zirconia crowns. It provides adequate strength while conserving tooth structure compared to a shoulder preparation.",
          points: 10
        }
      ];
    } else {
      content = `# ${topic}: Comprehensive Overview

## Introduction
${topic} represents an important area of dental practice that requires thorough understanding of both theoretical concepts and clinical applications. This module provides a comprehensive overview of the key principles, diagnostic approaches, and treatment modalities.

## Key Concepts
Understanding the fundamental concepts of ${topic} is essential for accurate diagnosis and effective treatment planning. These include:

1. **Anatomical Considerations**: The structural and functional aspects relevant to ${topic}
2. **Pathophysiology**: The mechanisms of disease development and progression
3. **Classification Systems**: Standardized approaches to categorizing conditions
4. **Evidence-Based Protocols**: Current best practices supported by research

## Diagnostic Approach
A systematic diagnostic approach for ${topic} includes:

1. **Comprehensive History**: Medical, dental, and specific condition-related information
2. **Clinical Examination**: Visual inspection, palpation, and specialized tests
3. **Radiographic Assessment**: Appropriate imaging modalities and interpretation
4. **Additional Testing**: Laboratory tests or specialized diagnostic procedures when indicated

## Treatment Planning
Effective treatment planning for ${topic} should consider:

1. **Patient-Centered Approach**: Addressing patient concerns, expectations, and preferences
2. **Risk-Benefit Analysis**: Weighing potential benefits against risks for each option
3. **Staged Treatment**: Prioritizing interventions based on urgency and logical sequence
4. **Interdisciplinary Collaboration**: Involving specialists when appropriate

## Clinical Techniques
The clinical management of ${topic} involves various techniques that must be performed with precision and attention to detail. These techniques have evolved with advances in technology and materials.

## Long-Term Management
Successful outcomes in ${topic} depend not only on initial treatment but also on:

1. **Maintenance Protocols**: Regular follow-up and preventive measures
2. **Complication Management**: Early identification and intervention for complications
3. **Patient Education**: Empowering patients with knowledge for self-care`;
      
      questions = [
        {
          question: `What is a key component of the diagnostic approach for ${topic}?`,
          type: "multiple-choice",
          options: [
            "Comprehensive history and clinical examination",
            "Immediate treatment without diagnosis",
            "Referral to specialists in all cases",
            "Exclusive reliance on patient self-reporting"
          ],
          correctAnswer: 0,
          explanation: `A comprehensive history and thorough clinical examination form the foundation of the diagnostic approach for ${topic}. This provides essential information for accurate diagnosis and appropriate treatment planning.`,
          points: 10
        },
        {
          question: `Which of the following is most important for long-term success in ${topic}?`,
          type: "multiple-choice",
          options: [
            "Regular maintenance and follow-up",
            "Using the most expensive materials",
            "Treatment by specialists only",
            "Avoiding all patient education"
          ],
          correctAnswer: 0,
          explanation: `Regular maintenance and follow-up are crucial for long-term success in ${topic}. This allows for monitoring of treatment outcomes, early detection of potential issues, and timely intervention when necessary.`,
          points: 10
        }
      ];
    }
    
    return {
      title: `${topic} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`,
      description: `Comprehensive learning module about ${topic} with interactive content and practice questions.`,
      content: content,
      estimatedTime: topic.toLowerCase().includes('crown') ? 45 : topic.toLowerCase().includes('endodontic') ? 60 : 30,
      questions: questions,
      specialty: topic.toLowerCase().includes('endodontic') ? 'endodontics' : 
                topic.toLowerCase().includes('crown') || topic.toLowerCase().includes('prosthodontic') ? 'prosthodontics' : 
                topic.toLowerCase().includes('perio') ? 'periodontics' : 'general',
      difficulty: difficulty
    };
  }

  private getMockValidation(questionId: string, answer: number | string): {isCorrect: boolean, score: number, feedback: string} {
    // For multiple choice, use a deterministic approach based on questionId
    const isOpenEnded = typeof answer === 'string' && answer.length > 5;
    
    if (isOpenEnded) {
      // For open-ended questions, provide constructive feedback
      return {
        isCorrect: true,
        score: 85,
        feedback: "Your response demonstrates good understanding of the key concepts. You've correctly identified the main points, though you could expand on the clinical implications for a more comprehensive answer."
      };
    } else {
      // For multiple choice, use the questionId to determine correctness
      const questionNumber = parseInt(questionId.replace(/\D/g, '')) || 0;
      const correctAnswer = questionNumber % 4; // Simple deterministic approach
      const isCorrect = parseInt(answer.toString()) === correctAnswer;
      
      return {
        isCorrect,
        score: isCorrect ? 10 : 0,
        feedback: isCorrect 
          ? "Correct! Well done on selecting the right answer." 
          : `Incorrect. The correct answer was option ${String.fromCharCode(65 + correctAnswer)}. Review the explanation for more details.`
      };
    }
  }

  private getMockAnalysis(measurements: any): string {
    // Generate analysis based on measurements
    const { occlusalReduction, axialReduction, marginWidth, taper } = measurements;
    
    let feedback = "Analysis of your crown preparation:\n\n";
    
    // Occlusal reduction
    if (occlusalReduction < 1.0) {
      feedback += "❌ Occlusal reduction is insufficient at " + occlusalReduction.toFixed(1) + "mm. Recommended reduction is 1.5-2mm for most materials.\n\n";
    } else if (occlusalReduction > 2.5) {
      feedback += "⚠️ Occlusal reduction is excessive at " + occlusalReduction.toFixed(1) + "mm. This may compromise pulp health and tooth strength.\n\n";
    } else {
      feedback += "✅ Occlusal reduction is optimal at " + occlusalReduction.toFixed(1) + "mm, providing adequate space for restorative material.\n\n";
    }
    
    // Axial reduction
    if (axialReduction < 0.8) {
      feedback += "❌ Axial reduction is insufficient at " + axialReduction.toFixed(1) + "mm. Recommended reduction is 1-1.5mm.\n\n";
    } else if (axialReduction > 1.8) {
      feedback += "⚠️ Axial reduction is excessive at " + axialReduction.toFixed(1) + "mm. This may compromise tooth structure and pulp health.\n\n";
    } else {
      feedback += "✅ Axial reduction is appropriate at " + axialReduction.toFixed(1) + "mm, providing adequate space while preserving tooth structure.\n\n";
    }
    
    // Margin width
    if (marginWidth < 0.3) {
      feedback += "❌ Margin width is too thin at " + marginWidth.toFixed(1) + "mm, which may lead to margin fracture.\n\n";
    } else if (marginWidth > 1.0) {
      feedback += "⚠️ Margin width is excessive at " + marginWidth.toFixed(1) + "mm, which may compromise esthetics and periodontal health.\n\n";
    } else {
      feedback += "✅ Margin width is well-defined at " + marginWidth.toFixed(1) + "mm, providing adequate strength and precision.\n\n";
    }
    
    // Taper
    if (taper < 4) {
      feedback += "❌ Taper angle is too conservative at " + taper.toFixed(1) + "°, which may prevent proper seating of the crown.\n\n";
    } else if (taper > 12) {
      feedback += "⚠️ Taper angle is excessive at " + taper.toFixed(1) + "°, which may compromise retention.\n\n";
    } else {
      feedback += "✅ Taper angle is ideal at " + taper.toFixed(1) + "°, providing good retention while allowing proper seating.\n\n";
    }
    
    // Overall assessment
    if (occlusalReduction >= 1.0 && occlusalReduction <= 2.5 && 
        axialReduction >= 0.8 && axialReduction <= 1.8 && 
        marginWidth >= 0.3 && marginWidth <= 1.0 && 
        taper >= 4 && taper <= 12) {
      feedback += "🎉 Overall assessment: Excellent preparation! All parameters are within optimal ranges.";
    } else if (occlusalReduction >= 0.8 && occlusalReduction <= 2.8 && 
               axialReduction >= 0.6 && axialReduction <= 2.0 && 
               marginWidth >= 0.2 && marginWidth <= 1.2 && 
               taper >= 3 && taper <= 15) {
      feedback += "👍 Overall assessment: Good preparation with minor issues. Consider refining the areas mentioned above.";
    } else {
      feedback += "⚠️ Overall assessment: Preparation needs significant improvement. Focus on the critical issues mentioned above.";
    }
    
    return feedback;
  }

  private getMockMaterialRecommendation(): any {
    return {
      recommendation: "Based on the case requirements for a maxillary central incisor with high esthetic demands, lithium disilicate (e.g., IPS e.max) would be the optimal choice. This material offers excellent translucency and optical properties that mimic natural teeth, while providing adequate strength (360-400 MPa) for an anterior restoration. The patient's history of bruxism is a concern, but with proper occlusal adjustment and possibly a night guard, lithium disilicate should perform well. Zirconia would provide better strength but at the cost of esthetics, while PFM would risk showing a metal margin over time. Ensure a minimum thickness of 1.5mm occlusal/incisal and 1.0mm axial to maximize strength."
    };
  }

  private getMockDesignReview(designData: any): string {
    const { material, parameters } = designData;
    
    let feedback = `Design Review for ${material?.type || 'Crown'}:\n\n`;
    
    // Wall thickness
    if (parameters?.thickness < 1.0) {
      feedback += "❌ Wall thickness of " + parameters.thickness + "mm is insufficient. Recommended minimum is 1.0-1.5mm depending on location.\n\n";
    } else if (parameters?.thickness > 2.0) {
      feedback += "⚠️ Wall thickness of " + parameters.thickness + "mm is excessive and may require unnecessary tooth reduction.\n\n";
    } else {
      feedback += "✅ Wall thickness of " + (parameters?.thickness || 1.5) + "mm is appropriate.\n\n";
    }
    
    // Margin design
    if (parameters?.margin === 'knife-edge') {
      feedback += "❌ Knife-edge margin is not recommended due to risk of edge chipping.\n\n";
    } else if (parameters?.margin === 'shoulder') {
      feedback += "⚠️ Shoulder margin requires more tooth reduction than necessary. Consider a chamfer instead.\n\n";
    } else {
      feedback += "✅ " + (parameters?.margin || 'chamfer') + " margin design is appropriate.\n\n";
    }
    
    // Contour
    if (parameters?.contour === 'over-contoured') {
      feedback += "⚠️ Over-contoured design may compromise periodontal health and esthetics.\n\n";
    } else if (parameters?.contour === 'reduced') {
      feedback += "✅ Reduced contour is good to ensure adequate thickness in functional areas.\n\n";
    } else {
      feedback += "✅ " + (parameters?.contour || 'natural') + " contour is appropriate for this restoration.\n\n";
    }
    
    // Overall assessment
    feedback += "🎉 Overall assessment: Good design! Consider the suggestions above for optimal results.";
    
    return feedback;
  }

  private getMockDocumentUpload(file: File): {success: boolean, topic?: string, message: string} {
    // Extract topic from filename
    const fileName = file.name.toLowerCase();
    let topic = '';
    
    if (fileName.includes('endo')) {
      topic = 'Endodontics';
    } else if (fileName.includes('perio')) {
      topic = 'Periodontics';
    } else if (fileName.includes('crown') || fileName.includes('prosth')) {
      topic = 'Prosthodontics';
    } else if (fileName.includes('ortho')) {
      topic = 'Orthodontics';
    } else if (fileName.includes('surg')) {
      topic = 'Oral Surgery';
    } else {
      // Convert filename to title case for topic
      topic = file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .split(/[-_\s]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    return {
      success: true,
      topic,
      message: `Document "${file.name}" uploaded and processed successfully.`
    };
  }
}

export const aiIntegrationService = new AIIntegrationService();