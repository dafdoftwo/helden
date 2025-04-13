"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiCalendar,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiAlertTriangle
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Promotion {
  id: number;
  code: string;
  type: string;
  value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
  description: string | null;
  applies_to: string;
  product_ids: number[] | null;
  category_ids: number[] | null;
  requires_login: boolean;
  is_onetime: boolean;
  created_at: string;
}

export default function PromotionDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const promotionId = params.id as string;
  
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/promotions/${promotionId}`);
    }
  }, [user, authLoading, router, language, promotionId]);
  
  // Fetch promotion data and related info
  useEffect(() => {
    if (user && promotionId) {
      fetchPromotionAndRelatedData();
    }
  }, [user, promotionId]);
  
  const fetchPromotionAndRelatedData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch promotion data
      const { data: promotionData, error: promotionError } = await supabase
        .from('promotions')
        .select('*')
        .eq('id', promotionId)
        .single();
      
      if (promotionError) throw promotionError;
      
      if (!promotionData) {
        throw new Error(t('admin.promotions.notFound'));
      }
      
      setPromotion(promotionData);
      
      // Fetch associated categories if needed
      if (promotionData.category_ids && promotionData.category_ids.length > 0) {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', promotionData.category_ids);
        
        if (categoriesError) throw categoriesError;
        
        if (categoriesData) {
          setCategories(categoriesData);
        }
      }
      
      // Fetch associated products if needed
      if (promotionData.product_ids && promotionData.product_ids.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .in('id', promotionData.product_ids);
        
        if (productsError) throw productsError;
        
        if (productsData) {
          setProducts(productsData);
        }
      }
      
      // Fetch orders that used this promotion code
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          created_at,
          total_amount,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('promotion_id', promotionId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (ordersError) throw ordersError;
      
      if (ordersData) {
        // Transform order data to match interface
        const formattedOrders = ordersData.map(order => ({
          id: order.id,
          order_number: order.order_number,
          created_at: order.created_at,
          total_amount: order.total_amount,
          customer: {
            first_name: order.profiles?.first_name || '',
            last_name: order.profiles?.last_name || '',
            email: order.profiles?.email || ''
          }
        }));
        
        setOrders(formattedOrders);
      }
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (err) {
      return dateString;
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete the promotion
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);
      
      if (error) throw error;
      
      // Close modal and redirect to promotions list
      setShowDeleteModal(false);
      router.push(`/${language}/admin/promotions`);
      
    } catch (err: any) {
      console.error('Error deleting promotion:', err);
      setError(err.message);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };
  
  const toggleStatus = async () => {
    if (!promotion) return;
    
    try {
      setIsUpdatingStatus(true);
      
      const newStatus = !promotion.is_active;
      
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: newStatus })
        .eq('id', promotionId);
      
      if (error) throw error;
      
      // Update local state
      setPromotion({
        ...promotion,
        is_active: newStatus
      });
      
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const renderDiscountValue = () => {
    if (!promotion) return null;
    
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return `$${promotion.value.toFixed(2)}`;
      case 'free_shipping':
        return t('admin.promotions.freeShipping');
      default:
        return `${promotion.value}`;
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  if (!promotion) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            {error || t('admin.promotions.notFound')}
          </div>
          <div className="mt-4">
            <Link 
              href={`/${language}/admin/promotions`}
              className="inline-flex items-center text-black hover:underline"
            >
              <FiArrowLeft className="mr-2" />
              {t('admin.promotions.backToList')}
            </Link>
          </div>
        </div>
      </div>
    );
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
              {promotion.code}
            </h1>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
              promotion.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {promotion.is_active ? t('admin.promotions.active') : t('admin.promotions.inactive')}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={toggleStatus}
              disabled={isUpdatingStatus}
              className={`flex items-center px-4 py-2 rounded-md ${
                promotion.is_active 
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {promotion.is_active ? <FiX className="mr-2" /> : <FiCheck className="mr-2" />}
              {promotion.is_active ? t('admin.promotions.deactivate') : t('admin.promotions.activate')}
            </button>
            <Link
              href={`/${language}/admin/promotions/${promotionId}/edit`}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <FiEdit className="mr-2" />
              {t('common.edit')}
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <FiTrash2 className="mr-2" />
              {t('common.delete')}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Basic Information */}
          <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiTag className="mr-2" />
              {t('admin.promotions.basicInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.code')}</h3>
                <p className="mt-1 text-lg">{promotion.code}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.description')}</h3>
                <p className="mt-1">{promotion.description || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.discountType')}</h3>
                <p className="mt-1 flex items-center">
                  {promotion.type === 'percentage' && <FiPercent className="mr-1" />}
                  {promotion.type === 'fixed' && <FiDollarSign className="mr-1" />}
                  {promotion.type === 'free_shipping' && <FiPackage className="mr-1" />}
                  {promotion.type === 'percentage' && t('admin.promotions.percentage')}
                  {promotion.type === 'fixed' && t('admin.promotions.fixedAmount')}
                  {promotion.type === 'free_shipping' && t('admin.promotions.freeShipping')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.discountValue')}</h3>
                <p className="mt-1 text-lg font-medium">{renderDiscountValue()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.minPurchase')}</h3>
                <p className="mt-1">
                  {promotion.min_purchase_amount 
                    ? `$${promotion.min_purchase_amount.toFixed(2)}` 
                    : t('admin.promotions.none')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.maxDiscount')}</h3>
                <p className="mt-1">
                  {promotion.max_discount_amount 
                    ? `$${promotion.max_discount_amount.toFixed(2)}` 
                    : t('admin.promotions.none')}
                </p>
              </div>
            </div>
            
            <hr className="my-6" />
            
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiCalendar className="mr-2" />
              {t('admin.promotions.validitySettings')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.startDate')}</h3>
                <p className="mt-1">{formatDate(promotion.start_date)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.endDate')}</h3>
                <p className="mt-1">{formatDate(promotion.end_date)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.usageLimit')}</h3>
                <p className="mt-1">{promotion.usage_limit || t('admin.promotions.unlimited')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.createdAt')}</h3>
                <p className="mt-1">{formatDate(promotion.created_at)}</p>
              </div>
            </div>
            
            <hr className="my-6" />
            
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiPackage className="mr-2" />
              {t('admin.promotions.appliesTo')}
            </h2>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.applicability')}</h3>
              <p className="mt-1">
                {promotion.applies_to === 'all' && t('admin.promotions.allProducts')}
                {promotion.applies_to === 'specific_categories' && t('admin.promotions.specificCategories')}
                {promotion.applies_to === 'specific_products' && t('admin.promotions.specificProducts')}
              </p>
              
              {promotion.applies_to === 'specific_categories' && categories.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.categoriesList')}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {categories.map(category => (
                      <span key={category.id} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {promotion.applies_to === 'specific_products' && products.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.productsList')}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {products.map(product => (
                      <span key={product.id} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        {product.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <hr className="my-6" />
            
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiShield className="mr-2" />
              {t('admin.promotions.restrictions')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.requiresLogin')}</h3>
                <p className="mt-1 flex items-center">
                  {promotion.requires_login 
                    ? <FiCheck className="mr-1 text-green-600" /> 
                    : <FiX className="mr-1 text-red-600" />}
                  {promotion.requires_login 
                    ? t('admin.promotions.yes') 
                    : t('admin.promotions.no')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.oneTimeUse')}</h3>
                <p className="mt-1 flex items-center">
                  {promotion.is_onetime 
                    ? <FiCheck className="mr-1 text-green-600" /> 
                    : <FiX className="mr-1 text-red-600" />}
                  {promotion.is_onetime 
                    ? t('admin.promotions.yes') 
                    : t('admin.promotions.no')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Usage Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiRefreshCw className="mr-2" />
              {t('admin.promotions.usageStatistics')}
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.promotions.usageCount')}</h3>
                <p className="mt-1 text-3xl font-bold">{promotion.usage_count}</p>
                
                {promotion.usage_limit && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (promotion.usage_count / promotion.usage_limit) > 0.75
                            ? 'bg-red-500'
                            : 'bg-black'
                        }`} 
                        style={{ width: `${Math.min(100, (promotion.usage_count / promotion.usage_limit) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('admin.promotions.usedOf')} {promotion.usage_count} / {promotion.usage_limit}
                    </p>
                  </div>
                )}
              </div>
              
              {promotion.usage_limit && promotion.usage_count >= promotion.usage_limit && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex items-start">
                  <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{t('admin.promotions.usageLimitReached')}</p>
                </div>
              )}
              
              {promotion.end_date && new Date(promotion.end_date) < new Date() && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex items-start">
                  <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{t('admin.promotions.expired')}</p>
                </div>
              )}
              
              {!promotion.is_active && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex items-start">
                  <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{t('admin.promotions.inactiveWarning')}</p>
                </div>
              )}
            </div>
            
            <hr className="my-6" />
            
            <h3 className="text-md font-semibold mb-3">
              {t('admin.promotions.recentOrders')}
            </h3>
            
            {orders.length > 0 ? (
              <div className="mt-3">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-3 py-2">{t('admin.orders.order')}</th>
                        <th className="px-3 py-2">{t('admin.orders.date')}</th>
                        <th className="px-3 py-2">{t('admin.orders.amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <Link 
                              href={`/${language}/admin/orders/${order.id}`}
                              className="text-black hover:underline"
                            >
                              #{order.order_number}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {order.customer.first_name} {order.customer.last_name}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-3 py-2 font-medium">
                            ${order.total_amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {orders.length > 0 && (
                  <div className="mt-3 text-center">
                    <Link
                      href={`/${language}/admin/orders?promotion=${promotionId}`}
                      className="text-sm text-black hover:underline"
                    >
                      {t('admin.promotions.viewAllOrders')}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                {t('admin.promotions.noOrders')}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {t('admin.promotions.confirmDelete')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('admin.promotions.deleteWarning')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}