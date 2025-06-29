import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Badge, QuizResult, AIAvatar, StudyGroup } from '../types';

interface GameState {
  user: User;
  currentModule: string | null;
  isQuizActive: boolean;
  currentStreak: number;
  aiAvatar: AIAvatar;
  studyGroups: StudyGroup[];
  isARVRMode: boolean;
  currentScene: 'dental-office' | 'lecture-room' | 'diagnosis-treatment' | 'laboratory' | null;
  multiplayer: {
    isActive: boolean;
    roomId: string | null;
    participants: User[];
  };
}

type GameAction = 
  | { type: 'EARN_XP'; payload: number }
  | { type: 'EARN_BADGE'; payload: Badge }
  | { type: 'START_MODULE'; payload: string }
  | { type: 'COMPLETE_QUIZ'; payload: QuizResult }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'SET_SCENE'; payload: 'dental-office' | 'lecture-room' | 'diagnosis-treatment' | 'laboratory' }
  | { type: 'TOGGLE_ARVR'; payload: boolean }
  | { type: 'JOIN_STUDY_GROUP'; payload: StudyGroup }
  | { type: 'LEAVE_STUDY_GROUP'; payload: string }
  | { type: 'UPDATE_AI_AVATAR'; payload: Partial<AIAvatar> }
  | { type: 'START_MULTIPLAYER'; payload: { roomId: string; participants: User[] } }
  | { type: 'END_MULTIPLAYER' };

const initialState: GameState = {
  user: {
    id: '1',
    name: 'Dr. Student',
    level: 3,
    xp: 1250,
    totalPoints: 1450,
    currentStreak: 7,
    studyTime: 24,
    globalRank: 47,
    badges: [
      {
        id: '1',
        name: 'Precision Star',
        description: 'Perfect crown preparation technique',
        icon: '⭐',
        earnedAt: new Date(),
        rarity: 'rare',
        color: 'text-yellow-500'
      },
      {
        id: '2',
        name: 'Speed Badge',
        description: 'Completed quiz in record time',
        icon: '⚡',
        earnedAt: new Date(),
        rarity: 'common',
        color: 'text-blue-500'
      }
    ]
  },
  currentModule: null,
  isQuizActive: false,
  currentStreak: 7,
  aiAvatar: {
    id: 'mentor-1',
    name: 'Dr. DentalMentor',
    specialty: 'prosthodontics',
    personality: 'supportive',
    voiceSettings: {
      pitch: 1.0,
      speed: 1.0,
      voice: 'en-US'
    },
    isActive: true
  },
  studyGroups: [],
  isARVRMode: false,
  currentScene: null,
  multiplayer: {
    isActive: false,
    roomId: null,
    participants: []
  }
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'EARN_XP':
      const newXP = Math.max(0, state.user.xp + action.payload);
      const newLevel = Math.floor(newXP / 500) + 1;
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXP,
          level: newLevel,
          totalPoints: Math.max(0, state.user.totalPoints + action.payload)
        }
      };
    case 'EARN_BADGE':
      return {
        ...state,
        user: {
          ...state.user,
          badges: [...state.user.badges, action.payload]
        }
      };
    case 'START_MODULE':
      return {
        ...state,
        currentModule: action.payload
      };
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload.xpEarned,
          totalPoints: state.user.totalPoints + action.payload.score,
          badges: [...state.user.badges, ...action.payload.badges]
        },
        isQuizActive: false
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        currentStreak: action.payload,
        user: {
          ...state.user,
          currentStreak: action.payload
        }
      };
    case 'SET_SCENE':
      return {
        ...state,
        currentScene: action.payload
      };
    case 'TOGGLE_ARVR':
      return {
        ...state,
        isARVRMode: action.payload
      };
    case 'JOIN_STUDY_GROUP':
      return {
        ...state,
        studyGroups: [...state.studyGroups, action.payload]
      };
    case 'LEAVE_STUDY_GROUP':
      return {
        ...state,
        studyGroups: state.studyGroups.filter(group => group.id !== action.payload)
      };
    case 'UPDATE_AI_AVATAR':
      return {
        ...state,
        aiAvatar: { ...state.aiAvatar, ...action.payload }
      };
    case 'START_MULTIPLAYER':
      return {
        ...state,
        multiplayer: {
          isActive: true,
          roomId: action.payload.roomId,
          participants: action.payload.participants
        }
      };
    case 'END_MULTIPLAYER':
      return {
        ...state,
        multiplayer: {
          isActive: false,
          roomId: null,
          participants: []
        }
      };
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};