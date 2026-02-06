"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure API-based authentication
class AuthService {
  private static async fetchCSRFToken(): Promise<string> {
    const response = await fetch("/api/auth/login");
    const data = await response.json();
    return data.csrfToken;
  }

  static async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User }> {
    try {
      // Get CSRF token
      const csrfToken = await this.fetchCSRFToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password, csrfToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, user: data.user };
      }

      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false };
    }
  }

  static async logout(): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  static async verifyToken(): Promise<{ isValid: boolean; user?: User }> {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.isValid) {
        return { isValid: true, user: data.user };
      }

      return { isValid: false };
    } catch (error) {
      console.error("Token verification error:", error);
      return { isValid: false };
    }
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      return response.ok;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      // Check for session hint cookie before making the verify API call
      // This avoids a redundant call on first visit or when clearly logged out
      const hasSessionHint = document.cookie
        .split("; ")
        .some((row) => row.startsWith("staffly_session_hint=true"));

      if (!hasSessionHint) {
        setLoading(false);
        return;
      }

      try {
        const { isValid, user: userData } = await AuthService.verifyToken();

        if (isValid && userData) {
          setUser(userData as User);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh tokens
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(
      async () => {
        const success = await AuthService.refreshToken();
        if (!success) {
          // Refresh failed, logout user
          await logout();
        }
      },
      10 * 60 * 1000,
    ); // Refresh every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  // Handle page visibility for security
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && isAuthenticated) {
        const { isValid } = await AuthService.verifyToken();
        if (!isValid) {
          await logout();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { success, user: userData } = await AuthService.login(
        email,
        password,
      );

      if (success && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      isAuthenticated,
    }),
    [user, loading, isAuthenticated],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
