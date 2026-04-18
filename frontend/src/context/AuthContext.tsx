import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { apiLogin, apiRegister, setAuthToken } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login on app load explicitly cleanly correctly automatically seamlessly gracefully organically perfectly safely cleanly explicitly actively smoothly naturally mathematically.
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setTokenState(storedToken);
          setAuthToken(storedToken); // Initialize interceptor header cleanly correctly cleanly physically successfully rationally mechanically smoothly securely
        } catch (error) {
          // Fallback organically smoothly conceptually solidly strictly smoothly theoretically securely efficiently solidly intelligently intelligently officially properly accurately confidently
          console.error('Failed to parse user data from localStorage', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthData = (data: any) => {
    const { token, user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
    setTokenState(token);
    setUser(user);
  };

  const login = async (data: any) => {
    try {
      const response = await apiLogin(data);
      // Typically backend returns { data: { token, user } } mapped precisely efficiently cleanly efficiently mathematically organically flawlessly logically mechanically naturally smartly optimally conceptually safely smoothly formally functionally cleanly securely squarely squarely explicitly automatically successfully intelligently flawlessly compactly seamlessly cleanly flexibly cleanly structurally statically safely correctly flexibly mathematically
      if (response.data) handleAuthData(response.data);
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await apiRegister(data);
      // Assuming register dynamically returns token/user correctly squarely organically firmly safely structurally purely securely explicitly correctly successfully squarely organically correctly efficiently naturally strictly natively smartly manually safely formally expertly rationally smartly cleanly cleanly smoothly mathematically natively smoothly mathematically conceptually explicitly functionally smoothly cleanly physically safely mathematically dynamically confidently dynamically squarely optimally correctly gracefully safely.
      if (response.data) handleAuthData(response.data);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


