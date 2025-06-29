import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  level: number;
  xp: number;
  totalPoints: number;
  badges: any[];
  currentStreak: number;
  studyTime: number;
  globalRank: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>('demo-token');
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    // Auto-authenticate with demo user
    const initAuth = async () => {
      // Simulate a brief loading period
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set demo student user
      const demoUser: User = {
        id: 'demo-student-1',
        name: 'Demo Student',
        email: 'student@demo.com',
        role: 'student',
        level: 3,
        xp: 1250,
        totalPoints: 1450,
        badges: [
          {
            id: '1',
            name: 'First Steps',
            description: 'Completed first quiz',
            icon: '🎯',
            rarity: 'common',
            color: 'text-blue-500'
          }
        ],
        currentStreak: 7,
        studyTime: 24,
        globalRank: 47
      };

      setUser(demoUser);
      setToken('demo-token');
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - automatically succeed
    const demoUser: User = {
      id: 'demo-student-1',
      name: 'Demo Student',
      email: email,
      role: email.includes('teacher') ? 'teacher' : 'student',
      level: 3,
      xp: 1250,
      totalPoints: 1450,
      badges: [],
      currentStreak: 7,
      studyTime: 24,
      globalRank: 47
    };

    setUser(demoUser);
    setToken('demo-token');
  };

  const register = async (userData: { name: string; email: string; password: string; role: string }) => {
    // Mock registration - automatically succeed
    const newUser: User = {
      id: 'demo-user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role as 'student' | 'teacher',
      level: 1,
      xp: 0,
      totalPoints: 0,
      badges: [],
      currentStreak: 0,
      studyTime: 0,
      globalRank: 999
    };

    setUser(newUser);
    setToken('demo-token');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};