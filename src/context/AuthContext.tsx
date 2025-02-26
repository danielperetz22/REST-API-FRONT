import React, { useState} from 'react';
import axiosInstance from './axiosInstance';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  userProfileImage: string | null;
  userUsername: string | null;
  isAuthenticated: boolean;
  login: (refreshToken: string, userId: string, userEmail: string, userUsername: string, userProfileImage: string) => void;
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
  const [userProfileImage, setUserProfileImage] = useState<string | null>(localStorage.getItem('userProfileImage'));
  const [userUsername, setUserUsername] = useState<string | null>(localStorage.getItem('userUsername'));

  const login = (refreshToken: string, userId: string, userEmail: string, userUsername: string, userProfileImage: string) => {
    try {

      localStorage.setItem("token", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userProfileImage", userProfileImage);
      localStorage.setItem("userUsername", userUsername);
  
      setToken(refreshToken);
      setUserId(userId);
      setUserEmail(userEmail);
      setUserProfileImage(userProfileImage);
      setUserUsername(userUsername);
  
      console.log("Login success:", { refreshToken, userId, userEmail, userProfileImage, userUsername });
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };
  
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('token');
      if (!refreshToken) throw new Error('No token found during logout');


      await axiosInstance.post('/auth/logout', { refreshToken });

      console.log('Logged out successfully');


      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userProfileImage');
      localStorage.removeItem('userUsername');

      setToken(null);
      setUserId(null);
      setUserEmail(null);
      setUserProfileImage(null);
      setUserUsername(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userEmail,
        userProfileImage,
        userUsername,
        isAuthenticated,
        
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};