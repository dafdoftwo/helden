"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  error: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Check if user is admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profile && profile.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(true);
        
        if (session?.user) {
          // Check if user is admin on auth state change
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (profile && profile.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      // Check if user is admin
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profile && profile.role === 'admin') {
          setIsAdmin(true);
        }
      }

      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      // Create profile for new user
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'customer'
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext); 