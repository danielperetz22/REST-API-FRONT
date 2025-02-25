import React, { useState} from 'react';
import axiosInstance from './axiosInstance';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  username: string | null;
  profileImage: string | null;
  isAuthenticated: boolean;
  login: (refreshToken: string, userId: string, userEmail: string, username: string, profileImage: string) => void;
  logout: () => Promise<void>;
}


const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Hook to consume the context easily
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const [username, setUserName] = useState<string | null>(localStorage.getItem('username'));
  const [profileImage, setProfileImage] = useState<string | null>(localStorage.getItem('profileImage'));

  const login = (refreshToken: string, userId: string, userEmail: string, username: string, profileImage: string) => {
    try {
      localStorage.setItem('token', refreshToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('username', username);
      localStorage.setItem('profileImage', profileImage);
  
      setToken(refreshToken);
      setUserId(userId);
      setUserEmail(userEmail);
      setUserName(username);
      setProfileImage(profileImage);
  
      console.log('Login success:', { refreshToken, userId, userEmail, username, profileImage });
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };
  

  // Called to log out
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('token');
      if (!refreshToken) throw new Error('No token found during logout');

      // Invalidate on server
      await axiosInstance.post('/auth/logout', { refreshToken });

      console.log('Logged out successfully');

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('username');
      localStorage.removeItem('profileImage');

      // Clear state
      setToken(null);
      setUserId(null);
      setUserEmail(null);
      setUserName(null);
      setProfileImage(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isAuthenticated = !!token;

  // On app load, we already do initial localStorage checks in useState calls above

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userEmail,
        username,
        profileImage,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};