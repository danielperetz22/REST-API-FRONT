import React, { useState, useEffect } from "react";
import { apiClient } from "../services/api_client";

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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("userEmail"));
  const [userProfileImage, setUserProfileImage] = useState<string | null>(localStorage.getItem("userProfileImage"));
  const [userUsername, setUserUsername] = useState<string | null>(localStorage.getItem("userUsername"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
      setUserEmail(localStorage.getItem("userEmail"));
      setUserProfileImage(localStorage.getItem("userProfileImage"));
      setUserUsername(localStorage.getItem("userUsername"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (
    refreshToken: string,
    userId: string,
    userEmail: string,
    userUsername: string,
    userProfileImage: string
  ) => {
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

      console.log("🔑 Login success:", {
        refreshToken,
        userId,
        userEmail,
        userProfileImage,
        userUsername,
      });

      window.location.reload(); 
    } catch (error) {
      console.error("❌ Failed to login:", error);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("token");
      if (!refreshToken) throw new Error("No token found during logout");

      await apiClient.post("/auth/logout", { refreshToken });

      console.log("🚪 Logged out successfully");

      localStorage.clear();

      setToken(null);
      setUserId(null);
      setUserEmail(null);
      setUserProfileImage(null);
      setUserUsername(null);

      window.location.reload(); // ריענון דף כדי לוודא שכל הנתונים מתאפסים
    } catch (error) {
      console.error("❌ Failed to logout:", error);
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
