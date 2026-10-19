import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * PRODUCTION PATTERN: Client-Side Auth State with OAuth 2.0 & Firebase Architecture
 *
 * In production, OAuth 2.0 flows (Google, Apple, GitHub) or Firebase Auth / Clerk
 * exchange authentication tokens (JWTs) stored securely in HttpOnly cookies or localStorage.
 *
 * This provider provides full persistent authentication, profile management,
 * and simulated OAuth 2.0 sign-in/sign-up out of the box without requiring external cloud billing.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("netflix_user");
      return savedUser
        ? JSON.parse(savedUser)
        : {
            id: "user_demo_01",
            name: "Debi",
            email: "debi@netflix-demo.com",
            avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
            plan: "Premium (4K + HDR)",
            memberSince: "August 2024",
            isGuest: false,
          };
    } catch (e) {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("netflix_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("netflix_user");
    }
  }, [user]);

  /**
   * Email/Password Sign-in
   */
  const login = (email, password) => {
    if (!email || !password) {
      throw new Error("Please provide both email and password.");
    }
    const displayName = email.split("@")[0];
    const loggedUser = {
      id: `user_${Date.now()}`,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: email,
      avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      plan: "Premium (4K + HDR)",
      memberSince: "2026",
      isGuest: false,
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  /**
   * User Registration / Sign-up
   */
  const signup = (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error("Please complete all registration fields.");
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: name,
      email: email,
      avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      plan: "Standard HD",
      memberSince: "2026",
      isGuest: false,
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return newUser;
  };

  /**
   * OAuth 2.0 Social Sign-in (Google / GitHub)
   */
  const loginWithOAuth = (provider = "Google") => {
    const oauthUser = {
      id: `oauth_${Date.now()}`,
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      plan: "Premium (4K + HDR)",
      memberSince: "2026",
      provider: provider,
      isGuest: false,
    };
    setUser(oauthUser);
    setIsAuthModalOpen(false);
    return oauthUser;
  };

  /**
   * Sign-out
   */
  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (mode = "signin") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithOAuth,
        logout,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
