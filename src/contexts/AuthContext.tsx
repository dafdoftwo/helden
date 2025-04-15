"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import client, { auth, getCurrentUser } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to fetch user data
  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial auth state detection
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      await refreshUser();
    };

    initAuth();

    // Subscribe to auth changes
    const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      // Clean up the subscription
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await auth.signInWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      await refreshUser();
      return { success: true };
    } catch (err: any) {
      console.error('Sign in error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setLoading(true);
      const { error } = await auth.signUpWithEmail(email, password, metadata);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Google sign in error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
      router.push('/');
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 