"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Mock user type to replace Supabase User
interface User {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication provider - replace Supabase with local storage implementation
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for user on mount
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user from storage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in implementation
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would validate with a backend
      // For now, we'll simulate a successful login
      if (email && password) {
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email: email,
          created_at: new Date().toISOString(),
          user_metadata: {
            full_name: email.split('@')[0]
          }
        };
        
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true };
      }
      
      return {
        success: false,
        error: 'Invalid credentials'
      };
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign up implementation
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setLoading(true);
      
      // Mock sign up functionality
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: email,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: metadata?.full_name || email.split('@')[0]
        }
      };
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Google sign in (mock)
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Mock Google auth - in real implementation would redirect to Google
      alert("Google authentication would happen here");
      
      // For demo purposes, create a mock Google user
      const mockUser: User = {
        id: `google_user_${Date.now()}`,
        email: 'google_user@example.com',
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: 'Google User'
        }
      };
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google sign in');
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    router.push('/');
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 