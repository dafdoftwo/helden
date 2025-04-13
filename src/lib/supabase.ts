"use client";

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { Provider } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create real Supabase client
const client = createClient<Database>(supabaseUrl, supabaseAnonKey);

console.log('Using real Supabase client with provided credentials');

// Export the client as 'supabase' (this export was missing)
export const supabase = client;
export default client;

// Auth helper functions
export const auth = {
  async signInWithEmail(email: string, password: string) {
    return await client.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signUpWithEmail(email: string, password: string, metadata?: Record<string, any>) {
    return await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  async signInWithGoogle() {
    return await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  async signOut() {
    return await client.auth.signOut();
  },

  async getSession() {
    return await client.auth.getSession();
  },

  async refreshSession() {
    return await client.auth.refreshSession();
  }
};

// Utility functions for user profile management
export async function getCurrentUser() {
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  if (userId) {
    return await client.from('profiles').select('*').eq('user_id', userId).single();
  }
  
  return { data: null, error: new Error('User ID is required') };
}

export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  return await client.from('profiles').update(updates).eq('user_id', userId);
}

export async function sendPasswordResetEmail(email: string) {
  return await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  return await client.auth.updateUser({
    password: newPassword
  });
}

// Product and order related functions
export const orders = {
  async getUserOrders(userId: string) {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    return { data, error };
  },
  
  async getOrderById(orderId: string) {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    return { data, error };
  }
};

export const products = {
  async getProducts(options?: { category?: string, limit?: number, offset?: number }) {
    let query = client
      .from('products')
      .select('*');
      
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    return await query;
  },
    
  async getProductById(id: string) {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    return { data, error };
  }
};

export const favorites = {
  async addFavorite(userId: string, productId: string) {
    const { data, error } = await client
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }]);
      
    return { data, error };
  },
    
  async removeFavorite(userId: string, productId: string) {
    const { error } = await client
      .from('favorites')
      .delete()
      .match({ user_id: userId, product_id: productId });
      
    return { error };
  },
    
  async getUserFavorites(userId: string) {
    const { data, error } = await client
      .from('favorites')
      .select('*')
      .eq('user_id', userId);
      
    return { data, error };
  },
    
  async isFavorite(userId: string, productId: string) {
    const { data, error } = await client
      .from('favorites')
      .select('*')
      .match({ user_id: userId, product_id: productId });
      
    return { data: data && data.length > 0, error };
  }
}; 