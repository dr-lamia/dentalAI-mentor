import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Google Generative AI
const API_KEY = process.env.GOOGLE_AI_API_KEY || 'your-google-ai-api-key-change-in-production';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// AI Q&A endpoint
router.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const prompt = context 
      ? `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`
      : `Question: ${question}\n\nAnswer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error('AI Q&A error:', error);
    res.status(500).json({ error: 'Error processing question' });
  }
});

// Generate quiz endpoint
router.get('/generate_quiz', async (req, res) => {
  try {
    const { topic, difficulty = 'medium', num_questions = 5 } = req.query;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Create a ${difficulty} level quiz about "${topic}" with ${num_questions} multiple choice questions.
    
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to generate valid quiz data' });
    }
    
    const quizData = JSON.parse(jsonMatch[0]);
    res.json(quizData);
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: 'Error generating quiz' });
  }
});

// Generate case study endpoint
router.get('/generate_case', async (req, res) => {
  try {
    const { topic, difficulty = 'medium' } = req.query;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Create a ${difficulty} level dental case study about "${topic}".
    
    Format the response as JSON with this structure:
    {
      "title": "Case study title",
      "patientHistory": "Detailed patient history",
      "clinicalFindings": ["Finding 1", "Finding 2", "Finding 3"],
      "labResults": ["Result 1", "Result 2"],
      "questions": [
        {
          "question": "Open-ended question about the case",
          "explanation": "Expected answer or key points",
          "points": 15
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to generate valid case study data' });
    }
    
    const caseData = JSON.parse(jsonMatch[0]);
    res.json(caseData);
  } catch (error) {
    console.error('Generate case study error:', error);
    res.status(500).json({ error: 'Error generating case study' });
  }
});

// Validate answer endpoint
router.post('/validate_answer', async (req, res) => {
  try {
    const { questionId, answer, studentId } = req.body;
    
    if (!questionId || answer === undefined || !studentId) {
      return res.status(400).json({ error: 'Question ID, answer, and student ID are required' });
    }

    // For multiple choice, we'd typically look up the correct answer
    // For open-ended, we'd use AI to evaluate
    const isOpenEnded = typeof answer === 'string' && answer.length > 5;
    
    if (isOpenEnded) {
      const prompt = `Evaluate this student's response:
      
      Question ID: ${questionId}
      Student Response: ${answer}
      
      Provide a score out of 100 and constructive feedback. Format as JSON:
      {
        "score": 85,
        "feedback": "Your response shows good understanding of... Consider also mentioning..."
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(500).json({ error: 'Failed to generate valid evaluation' });
      }
      
      const evaluation = JSON.parse(jsonMatch[0]);
      res.json({
        isCorrect: evaluation.score >= 70,
        score: evaluation.score,
        feedback: evaluation.feedback
      });
    } else {
      // Mock validation for multiple choice (in production, would check against database)
      // This is just a placeholder - in a real app, you'd validate against stored correct answers
      const mockCorrectAnswer = (parseInt(questionId.replace(/\D/g, '')) % 4); // Simple mock
      const isCorrect = parseInt(answer) === mockCorrectAnswer;
      
      res.json({
        isCorrect,
        score: isCorrect ? 10 : 0,
        feedback: isCorrect 
          ? 'Correct! Well done.' 
          : `Incorrect. The correct answer was option ${String.fromCharCode(65 + mockCorrectAnswer)}.`
      });
    }
  } catch (error) {
    console.error('Validate answer error:', error);
    res.status(500).json({ error: 'Error validating answer' });
  }
});

// Analyze preparation endpoint
router.post('/analyze_prep', async (req, res) => {
  try {
    const { meshData, measurements } = req.body;
    
    // In a real app, you'd analyze the 3D mesh data
    // Here we'll use the measurements to generate feedback
    
    let prompt = 'Analyze this dental crown preparation and provide detailed feedback:';
    
    if (measurements) {
      prompt += `\n\nMeasurements:
      - Occlusal Reduction: ${measurements.occlusalReduction || 'N/A'} mm
      - Axial Reduction: ${measurements.axialReduction || 'N/A'} mm
      - Margin Width: ${measurements.marginWidth || 'N/A'} mm
      - Taper: ${measurements.taper || 'N/A'} degrees`;
    }
    
    prompt += `\n\nProvide specific feedback on:
    1. Adequacy of reduction
    2. Taper angle appropriateness
    3. Margin quality
    4. Overall preparation quality
    5. Recommendations for improvement`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    res.json({ feedback });
  } catch (error) {
    console.error('Analyze preparation error:', error);
    res.status(500).json({ error: 'Error analyzing preparation' });
  }
});

// Recommend material endpoint
router.get('/recommend_material', async (req, res) => {
  try {
    const { caseId } = req.query;
    
    if (!caseId) {
      return res.status(400).json({ error: 'Case ID is required' });
    }

    // In a real app, you'd fetch the case details from the database
    // Here we'll use a mock case for demonstration
    
    const prompt = `Recommend the optimal dental material for this case:
    
    Case: Anterior crown restoration for maxillary central incisor
    Requirements: High esthetics, normal occlusion
    Contraindications: Patient has history of bruxism
    
    Provide a detailed recommendation with rationale. Format as JSON:
    {
      "recommendation": "Detailed material recommendation with rationale"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to generate valid recommendation' });
    }
    
    const recommendation = JSON.parse(jsonMatch[0]);
    res.json(recommendation);
  } catch (error) {
    console.error('Recommend material error:', error);
    res.status(500).json({ error: 'Error recommending material' });
  }
});

// Review design endpoint
router.post('/review_design', async (req, res) => {
  try {
    const { material, parameters, caseDetails } = req.body;
    
    if (!material || !parameters) {
      return res.status(400).json({ error: 'Material and parameters are required' });
    }

    const prompt = `Review this dental crown design:
    
    Material: ${material}
    Parameters:
    - Thickness: ${parameters.thickness} mm
    - Margin design: ${parameters.margin}
    - Contour: ${parameters.contour}
    - Occlusion: ${parameters.occlusion || 'balanced'}
    
    Case details:
    - Tooth: ${caseDetails?.tooth || 'Maxillary central incisor'}
    - Requirements: ${caseDetails?.requirements?.join(', ') || 'High esthetics'}
    
    Provide detailed feedback on the design, including strengths, potential issues, and recommendations for improvement.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    res.json({ feedback });
  } catch (error) {
    console.error('Review design error:', error);
    res.status(500).json({ error: 'Error reviewing design' });
  }
});

// Document upload and processing endpoint
router.post('/upload', async (req, res) => {
  try {
    // In a real app, you'd process the uploaded file
    // Here we'll simulate successful upload
    
    // Mock file processing
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract topic from filename (in production, you'd analyze the content)
    const filename = file.originalname || 'document';
    const topic = extractTopicFromFilename(filename);

    res.json({
      success: true,
      message: 'Document uploaded and processed successfully',
      topic
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Error uploading document' });
  }
});

// Helper function to extract topic from filename
function extractTopicFromFilename(filename) {
  // Remove extension
  const nameOnly = filename.replace(/\.[^/.]+$/, "");
  
  // Convert to title case
  const words = nameOnly.split(/[-_\s]/);
  const titleCase = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  return titleCase;
}

export default router;