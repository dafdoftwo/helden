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
  FiAlertCircle,
} from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

export default function AddPromotionPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_purchase_amount: '',
    max_discount_amount: '',
    start_date: '',
    end_date: '',
    is_active: true,
    usage_limit: '',
    description: '',
    applies_to: 'all',
    product_ids: [] as number[],
    category_ids: [] as number[],
    requires_login: true,
    is_onetime: false
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/promotions/add`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch categories and products for dropdown
  useEffect(() => {
    if (user) {
      fetchCategoriesAndProducts();
    }
  }, [user]);
  
  // Set default start date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, start_date: formattedDate }));
  }, []);
  
  const fetchCategoriesAndProducts = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (categoriesError) throw categoriesError;
      
      if (categoriesData) {
        setCategories(categoriesData);
      }
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (productsError) throw productsError;
      
      if (productsData) {
        setProducts(productsData);
      }
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'value' || name === 'min_purchase_amount' || name === 'max_discount_amount' || name === 'usage_limit') {
      // Only allow numbers and decimal point for numeric fields
      if (value === '' || /^[0-9]+\.?[0-9]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setFormData(prev => ({ ...prev, category_ids: selectedOptions }));
  };
  
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setFormData(prev => ({ ...prev, product_ids: selectedOptions }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      // Validate required fields
      if (!formData.code || !formData.value || !formData.start_date) {
        throw new Error(t('admin.promotions.errorRequiredFields'));
      }
      
      // Validate code format (alphanumeric without spaces)
      if (!/^[A-Za-z0-9]+$/.test(formData.code)) {
        throw new Error(t('admin.promotions.errorInvalidCodeFormat'));
      }
      
      // Check if code already exists
      const { data: existingPromotion, error: checkError } = await supabase
        .from('promotions')
        .select('id')
        .eq('code', formData.code.toUpperCase())
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingPromotion) {
        throw new Error(t('admin.promotions.errorCodeExists'));
      }
      
      // Prepare data for insertion
      const promotionData = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : null,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        usage_count: 0,
        description: formData.description || null,
        applies_to: formData.applies_to,
        product_ids: formData.applies_to === 'specific_products' ? formData.product_ids : null,
        category_ids: formData.applies_to === 'specific_categories' ? formData.category_ids : null,
        requires_login: formData.requires_login,
        is_onetime: formData.is_onetime
      };
      
      // Create promotion in database
      const { data, error } = await supabase
        .from('promotions')
        .insert(promotionData)
        .select();
      
      if (error) throw error;
      
      setSuccessMessage(t('admin.promotions.successAdd'));
      
      // Redirect to promotions list after short delay
      setTimeout(() => {
        router.push(`/${language}/admin/promotions`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error adding promotion:', err);
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
            <Link href={`/${language}/admin/promotions`} className="mr-4">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">
              {t('admin.promotions.addPromotion')}
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/${language}/admin/promotions`}
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
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">{t('admin.promotions.basicInfo')}</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                {t('admin.promotions.code')} *
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('admin.promotions.codeHelp')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                {t('admin.promotions.description')}
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                {t('admin.promotions.discountType')} *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="percentage">{t('admin.promotions.percentage')}</option>
                <option value="fixed">{t('admin.promotions.fixedAmount')}</option>
                <option value="free_shipping">{t('admin.promotions.freeShipping')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="value">
                {t('admin.promotions.discountValue')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {formData.type === 'percentage' ? '%' : '$'}
                </div>
              </div>
              {formData.type === 'percentage' && parseInt(formData.value) > 100 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {t('admin.promotions.percentageWarning')}
                </p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mt-4 mb-4">{t('admin.promotions.validitySettings')}</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start_date">
                {t('admin.promotions.startDate')} *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end_date">
                {t('admin.promotions.endDate')}
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('admin.promotions.endDateHelp')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="usage_limit">
                {t('admin.promotions.usageLimit')}
              </label>
              <input
                type="text"
                id="usage_limit"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('admin.promotions.usageLimitHelp')}
              </p>
            </div>
            
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                {t('admin.promotions.isActive')}
              </label>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mt-4 mb-4">{t('admin.promotions.constraintSettings')}</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="min_purchase_amount">
                {t('admin.promotions.minPurchase')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  id="min_purchase_amount"
                  name="min_purchase_amount"
                  value={formData.min_purchase_amount}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="max_discount_amount">
                {t('admin.promotions.maxDiscount')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  id="max_discount_amount"
                  name="max_discount_amount"
                  value={formData.max_discount_amount}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('admin.promotions.maxDiscountHelp')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="applies_to">
                {t('admin.promotions.appliesTo')}
              </label>
              <select
                id="applies_to"
                name="applies_to"
                value={formData.applies_to}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">{t('admin.promotions.allProducts')}</option>
                <option value="specific_categories">{t('admin.promotions.specificCategories')}</option>
                <option value="specific_products">{t('admin.promotions.specificProducts')}</option>
              </select>
            </div>
            
            {formData.applies_to === 'specific_categories' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category_ids">
                  {t('admin.promotions.selectCategories')} *
                </label>
                <select
                  id="category_ids"
                  name="category_ids"
                  multiple
                  value={formData.category_ids.map(id => id.toString())}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  size={5}
                  required={formData.applies_to === 'specific_categories'}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin.promotions.multipleSelectionHelp')}
                </p>
              </div>
            )}
            
            {formData.applies_to === 'specific_products' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product_ids">
                  {t('admin.promotions.selectProducts')} *
                </label>
                <select
                  id="product_ids"
                  name="product_ids"
                  multiple
                  value={formData.product_ids.map(id => id.toString())}
                  onChange={handleProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  size={5}
                  required={formData.applies_to === 'specific_products'}
                >
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin.promotions.multipleSelectionHelp')}
                </p>
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requires_login"
                name="requires_login"
                checked={formData.requires_login}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="requires_login" className="ml-2 block text-sm text-gray-700">
                {t('admin.promotions.requiresLogin')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_onetime"
                name="is_onetime"
                checked={formData.is_onetime}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="is_onetime" className="ml-2 block text-sm text-gray-700">
                {t('admin.promotions.oneTimeUse')}
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href={`/${language}/admin/promotions`}
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