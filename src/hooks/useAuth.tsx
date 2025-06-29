import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authAPI } from '../services/api';
import socketService from '../services/socketService';

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.data.user);
          
          // Connect to socket
          socketService.connect(savedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Connect to socket
      socketService.connect(newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Connect to socket
      socketService.connect(newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Disconnect socket
    socketService.disconnect();
    
    // Call logout endpoint
    authAPI.logout().catch(console.error);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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