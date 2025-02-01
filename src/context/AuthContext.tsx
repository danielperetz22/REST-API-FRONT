import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  login: ( refreshToken: string, userId: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem('userId')
  );
 
  const login = ( refreshToken: string, userId: string) => {
    try {
      localStorage.setItem('token', refreshToken);
      localStorage.setItem('userId', userId);

      setToken(refreshToken);
      setUserId(userId);
    } catch (error) {
      console.error('Failed to login:', error);
    }
    console.log("Token after login:", refreshToken);
    console.log("User ID after login:", userId);
    console.log("Stored token in localStorage:", localStorage.getItem("token"));

  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('token');
      if (!refreshToken) throw new Error('No token found during logout');

      await axiosInstance.post('/auth/logout', { refreshToken });
      console.log('Logged out successfully');

      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      setToken(null);
      setUserId(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
 
  
    if (storedToken) {
      console.log("Restoring token from localStorage:", storedToken);
      setToken(storedToken);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};