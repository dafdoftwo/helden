"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { CouponCode } from '@/components/marketing/PromoPopup';

interface PromoNewPageProps {
  params: {
    locale: string;
  };
}

export default function PromoNewPage({ params }: PromoNewPageProps) {
  const { locale } = params;
  const router = useRouter();
  const { t, dir } = useTranslation();
  const { user, loading, isAdmin } = useUser();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: generatePromotionCode(),
    discount_type: 'percentage',
    discount_value: 10,
    min_purchase_amount: 0,
    max_discount_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    is_single_use: false,
    applies_to: 'all',
    category_id: '',
    product_id: '',
    usage_limit: 0,
    usage_count: 0
  });
  
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pageStatus, setPageStatus] = useState('loading');
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push(`/${locale}/auth/login`);
          return;
        }
        
        if (!isAdmin) {
          router.push(`/${locale}`);
          return;
        }
        
        fetchData();
      }
    };
    
    checkAdmin();
  }, [user, loading, isAdmin, locale, router]);
  
  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
        
      if (categoryError) throw categoryError;
      
      // Fetch featured products
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('is_featured', true)
        .order('name')
        .limit(10);
        
      if (productError) throw productError;
      
      setCategories(categoryData || []);
      setFeaturedProducts(productData || []);
      setPageStatus('ready');
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setPageStatus('error');
      setMessage({ 
        type: 'error', 
        text: t('marketing.errorLoading') 
      });
    }
  };
  
  function generatePromotionCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const regenerateCode = () => {
    setFormData(prev => ({ ...prev, code: generatePromotionCode() }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Validate the form
      if (!formData.title.trim()) {
        throw new Error(t('marketing.titleRequired'));
      }
      
      if (formData.discount_type === 'percentage' && (formData.discount_value <= 0 || formData.discount_value > 100)) {
        throw new Error(t('marketing.percentageError'));
      }
      
      if (formData.discount_type === 'fixed' && formData.discount_value <= 0) {
        throw new Error(t('marketing.discountError'));
      }
      
      if (formData.end_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
        throw new Error(t('marketing.dateError'));
      }
      
      // Prepare data for saving
      const promotionData = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id
      };
      
      // Insert the promotion
      const { data, error } = await supabase
        .from('promotions')
        .insert(promotionData)
        .select();
        
      if (error) throw error;
      
      setMessage({
        type: 'success',
        text: t('marketing.promoCreated')
      });
      
      // Redirect to promotions list after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/marketing/promotions`);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      setMessage({
        type: 'error',
        text: error.message || t('marketing.promoError')
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (pageStatus === 'loading' || loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activeItem="marketing" params={params} />
        <div className="flex-1 p-10">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-helden-purple"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100" dir={dir}>
      <AdminSidebar activeItem="marketing" params={params} />
      <div className="flex-1 p-5 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('marketing.createPromotion')}</h1>
          <Link
            href={`/${locale}/marketing/promotions`}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            {t('common.cancel')}
          </Link>
        </div>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium mb-4">{t('marketing.promoDetails')}</h2>
              </div>
              
              {/* Basic Information */}
              <div>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.promoTitle')} *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.promoDescription')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.promoCode')}
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-helden-purple focus:border-helden-purple"
                    />
                    <button
                      type="button"
                      onClick={regenerateCode}
                      className="py-2 px-4 bg-helden-purple text-white rounded-r-md"
                    >
                      {t('marketing.regenerate')}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                      {t('marketing.activePromo')}
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Discount */}
              <div>
                <div className="mb-4">
                  <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.discountType')} *
                  </label>
                  <select
                    id="discount_type"
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  >
                    <option value="percentage">{t('marketing.percentage')}</option>
                    <option value="fixed">{t('marketing.fixedAmount')}</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.discountValue')} *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="discount_value"
                      name="discount_value"
                      value={formData.discount_value}
                      onChange={handleNumberChange}
                      min={0}
                      max={formData.discount_type === 'percentage' ? 100 : undefined}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    />
                    <span className="ml-2 py-2">
                      {formData.discount_type === 'percentage' ? '%' : t('common.currency')}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="min_purchase_amount" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.minPurchase')}
                  </label>
                  <div className="flex">
                    <span className="py-2 pr-2">{t('common.currency')}</span>
                    <input
                      type="number"
                      id="min_purchase_amount"
                      name="min_purchase_amount"
                      value={formData.min_purchase_amount}
                      onChange={handleNumberChange}
                      min={0}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    />
                  </div>
                </div>
                
                {formData.discount_type === 'percentage' && (
                  <div className="mb-4">
                    <label htmlFor="max_discount_amount" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('marketing.maxDiscount')}
                    </label>
                    <div className="flex">
                      <span className="py-2 pr-2">{t('common.currency')}</span>
                      <input
                        type="number"
                        id="max_discount_amount"
                        name="max_discount_amount"
                        value={formData.max_discount_amount}
                        onChange={handleNumberChange}
                        min={0}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('marketing.maxDiscountHelp')}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium mb-4">{t('marketing.validityAndRestrictions')}</h2>
              </div>
              
              {/* Dates and Validity */}
              <div>
                <div className="mb-4">
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.startDate')} *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.endDate')}
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('marketing.endDateHelp')}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.usageLimit')}
                  </label>
                  <input
                    type="number"
                    id="usage_limit"
                    name="usage_limit"
                    value={formData.usage_limit}
                    onChange={handleNumberChange}
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('marketing.usageLimitHelp')}
                  </p>
                </div>
              </div>
              
              {/* Applies To */}
              <div>
                <div className="mb-4">
                  <label htmlFor="applies_to" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('marketing.appliesTo')} *
                  </label>
                  <select
                    id="applies_to"
                    name="applies_to"
                    value={formData.applies_to}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                  >
                    <option value="all">{t('marketing.allProducts')}</option>
                    <option value="category">{t('marketing.specificCategory')}</option>
                    <option value="product">{t('marketing.specificProduct')}</option>
                  </select>
                </div>
                
                {formData.applies_to === 'category' && (
                  <div className="mb-4">
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('marketing.selectCategory')} *
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    >
                      <option value="">{t('marketing.selectOption')}</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {formData.applies_to === 'product' && (
                  <div className="mb-4">
                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('marketing.selectProduct')} *
                    </label>
                    <select
                      id="product_id"
                      name="product_id"
                      value={formData.product_id}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    >
                      <option value="">{t('marketing.selectOption')}</option>
                      {featuredProducts.map((product: any) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price} {t('common.currency')}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('marketing.featuredProductsNote')}
                    </p>
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_single_use"
                      name="is_single_use"
                      checked={formData.is_single_use}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                    />
                    <label htmlFor="is_single_use" className="ml-2 block text-sm text-gray-700">
                      {t('marketing.singleUse')}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    {t('marketing.singleUseHelp')}
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">{t('marketing.promoPreview')}</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">{formData.title}</p>
                  {formData.description && <p className="text-gray-600 mb-3">{formData.description}</p>}
                  
                  <CouponCode 
                    code={formData.code} 
                    discount={
                      formData.discount_type === 'percentage'
                        ? `${formData.discount_value}%`
                        : `${formData.discount_value} ${t('common.currency')}`
                    }
                    expiryDate={formData.end_date || undefined}
                  />
                  
                  <div className="mt-3 text-sm text-gray-600">
                    {formData.min_purchase_amount > 0 && (
                      <p>
                        {t('marketing.minPurchaseNote')} {formData.min_purchase_amount} {t('common.currency')}
                      </p>
                    )}
                    
                    {formData.applies_to !== 'all' && (
                      <p>
                        {formData.applies_to === 'category'
                          ? t('marketing.categoryRestriction')
                          : t('marketing.productRestriction')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link
                href={`/${locale}/marketing/promotions`}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 mr-2"
              >
                {t('common.cancel')}
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-helden-purple text-white rounded-md hover:bg-helden-purple-dark disabled:opacity-50"
              >
                {isSubmitting ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 