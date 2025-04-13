"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiArrowLeft,
  FiSave,
  FiX,
} from 'react-icons/fi';

export default function AddCustomerPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: 'customer',
    is_active: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/customers/add`);
    }
  }, [user, authLoading, router, language]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
        throw new Error(t('admin.customers.errorRequiredFields'));
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error(t('admin.customers.errorInvalidEmail'));
      }
      
      // Validate password
      if (formData.password.length < 8) {
        throw new Error(t('admin.customers.errorPasswordTooShort'));
      }
      
      // Confirm passwords match
      if (formData.password !== formData.confirm_password) {
        throw new Error(t('admin.customers.errorPasswordsDoNotMatch'));
      }
      
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role
          }
        }
      });
      
      if (authError) throw authError;
      
      // If user created successfully, update the profile with additional information
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone || null,
            is_active: formData.is_active
          })
          .eq('id', authData.user.id);
        
        if (profileError) throw profileError;
      }
      
      setSuccessMessage(t('admin.customers.successAdd'));
      
      // Reset form after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        role: 'customer',
        is_active: true
      });
      
      // Redirect to customers list after short delay
      setTimeout(() => {
        router.push(`/${language}/admin/customers`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error adding customer:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href={`/${language}/admin/customers`} className="mr-4">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">
              {t('admin.customers.addCustomer')}
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/${language}/admin/customers`}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <FiX className="mr-2" />
              {t('common.cancel')}
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2" />
              {isSubmitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 text-green-800 p-4 mb-4 rounded-md">
            {successMessage}
          </div>
        )}
        
        <form className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                {t('admin.customers.firstName')} *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                {t('admin.customers.lastName')} *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                {t('admin.customers.email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                {t('admin.customers.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                {t('admin.customers.password')} *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('admin.customers.passwordRequirements')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm_password">
                {t('admin.customers.confirmPassword')} *
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                {t('admin.customers.role')} *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="customer">{t('admin.customers.customerRole')}</option>
                <option value="admin">{t('admin.customers.adminRole')}</option>
              </select>
            </div>
            
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                {t('admin.customers.isActive')}
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href={`/${language}/admin/customers`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 