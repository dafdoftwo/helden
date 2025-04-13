"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  FiSave,
  FiX,
} from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
}

export default function AddSubcategoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    is_active: true,
    seo_title: '',
    seo_description: '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Load user data and check admin permission
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/categories/subcategories/add`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);
  
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
      if (!formData.name || !formData.category_id) {
        throw new Error(t('admin.categories.errorRequiredFields'));
      }
      
      // Create subcategory in database
      const { data, error } = await supabase
        .from('subcategories')
        .insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          category_id: parseInt(formData.category_id),
          is_active: formData.is_active,
          seo_title: formData.seo_title || null,
          seo_description: formData.seo_description || null
        })
        .select();
      
      if (error) throw error;
      
      setSuccessMessage(t('admin.categories.successAddSub'));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        slug: '',
        description: '',
        category_id: '',
        is_active: true,
        seo_title: '',
        seo_description: '',
      });
      
      // Redirect to categories list after short delay
      setTimeout(() => {
        router.push(`/${language}/admin/categories`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error adding subcategory:', err);
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
          <h1 className="text-2xl font-bold">{t('admin.categories.addSubcategory')}</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/${language}/admin/categories`)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <FiX className="mr-2" />
              {t('common.cancel')}
            </button>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category_id">
                {t('admin.categories.parentCategory')} *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">{t('admin.categories.selectCategory')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                {t('admin.categories.name')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="slug">
                {t('admin.categories.slug')} *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{t('admin.categories.slugHelp')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                {t('admin.categories.description')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                {t('admin.categories.isActive')}
              </label>
            </div>
            
            <h2 className="text-lg font-semibold border-b pb-2 mt-6">{t('admin.categories.seoInfo')}</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="seo_title">
                {t('admin.categories.seoTitle')}
              </label>
              <input
                type="text"
                id="seo_title"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="seo_description">
                {t('admin.categories.seoDescription')}
              </label>
              <textarea
                id="seo_description"
                name="seo_description"
                value={formData.seo_description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push(`/${language}/admin/categories`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
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