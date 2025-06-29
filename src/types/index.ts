export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalPoints: number;
  badges: Badge[];
  avatar?: string;
  currentStreak: number;
  studyTime: number;
  globalRank: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  specialty: DentalSpecialty;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  xpReward: number;
  isLocked: boolean;
  completionRate: number;
  moduleType: ModuleType;
  prerequisites?: string[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  specialty: DentalSpecialty;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  imageUrl?: string;
  xrayUrl?: string;
  type: 'multiple-choice' | 'scenario-based' | 'case-study';
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  badges: Badge[];
  timeSpent: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  patientHistory: string;
  clinicalFindings: string[];
  labResults?: string[];
  images: string[];
  xrays: string[];
  questions: Question[];
  specialty: DentalSpecialty;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SimulationTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'preparation' | 'restoration' | 'diagnosis' | 'treatment';
  isUnlocked: boolean;
}

export interface Material {
  id: string;
  name: string;
  type: 'PFM' | 'zirconia' | 'lithium-disilicate' | 'composite' | 'amalgam';
  properties: {
    strength: number;
    aesthetics: number;
    durability: number;
    biocompatibility: number;
  };
  indications: string[];
  contraindications: string[];
  cost: 'low' | 'medium' | 'high';
}

export interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  tips: string[];
  commonPitfalls: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface Procedure {
  id: string;
  name: string;
  specialty: DentalSpecialty;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: ProcedureStep[];
  materials: Material[];
  tools: SimulationTool[];
}

export type ModuleType = 
  | 'dental-office'
  | 'lecture-room'
  | 'diagnosis-treatment'
  | 'laboratory'
  | 'ar-vr'
  | 'multiplayer';

export type DentalSpecialty = 
  | 'endodontics'
  | 'periodontics' 
  | 'prosthodontics'
  | 'orthodontics'
  | 'pedodontics'
  | 'oral-surgery'
  | 'oral-medicine'
  | 'radiology'
  | 'public-health';

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  weeklyGain: number;
  isOnline: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  members: User[];
  currentModule?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AIAvatar {
  id: string;
  name: string;
  specialty: DentalSpecialty;
  personality: 'supportive' | 'challenging' | 'encouraging';
  voiceSettings: {
    pitch: number;
    speed: number;
    voice: string;
  };
  isActive: boolean;
}

export interface ARVRSession {
  id: string;
  type: 'AR' | 'VR';
  moduleId: string;
  isActive: boolean;
  participants: User[];
  startedAt: Date;
}

// Additional types for the new EduDash system
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'image';
  content: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  subject: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  subject: string;
  createdBy: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'quiz' | 'module' | 'case-study';
  metadata?: any;
}

export interface CaseStudyResult {
  id: string;
  caseStudyId: string;
  studentId: string;
  responses: CaseStudyResponse[];
  score: number;
  completedAt: Date;
}

export interface CaseStudyResponse {
  questionId: string;
  response: string;
  score: number;
  feedback: string;
}