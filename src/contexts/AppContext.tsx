import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Student, Teacher, Document, Module, Quiz, CaseStudy, ChatMessage, StudySession } from '../types';

interface AppState {
  currentUser: User | null;
  userRole: 'teacher' | 'student' | null;
  documents: Document[];
  modules: Module[];
  quizzes: Quiz[];
  caseStudies: CaseStudy[];
  chatMessages: ChatMessage[];
  currentSession: StudySession | null;
  availableTopics: string[];
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ROLE'; payload: 'teacher' | 'student' }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'ADD_MODULE'; payload: Module }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'ADD_CASE_STUDY'; payload: CaseStudy }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'START_SESSION'; payload: StudySession }
  | { type: 'END_SESSION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_TOPICS'; payload: string[] };

const initialState: AppState = {
  currentUser: null,
  userRole: null,
  documents: [],
  modules: [],
  quizzes: [],
  caseStudies: [],
  chatMessages: [],
  currentSession: null,
  availableTopics: [
    'Crown Preparation',
    'Endodontic Case Study',
    'Periodontal Disease',
    'Orthodontic Treatment',
    'Oral Surgery',
    'Dental Implants',
    'Prosthodontics',
    'Pediatric Dentistry',
    'Oral Pathology',
    'Dental Materials'
  ],
  isLoading: false
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ROLE':
      return { ...state, userRole: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'ADD_MODULE':
      return { ...state, modules: [...state.modules, action.payload] };
    case 'ADD_QUIZ':
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    case 'ADD_CASE_STUDY':
      return { ...state, caseStudies: [...state.caseStudies, action.payload] };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'START_SESSION':
      return { ...state, currentSession: action.payload };
    case 'END_SESSION':
      return { ...state, currentSession: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_TOPICS':
      return { ...state, availableTopics: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};