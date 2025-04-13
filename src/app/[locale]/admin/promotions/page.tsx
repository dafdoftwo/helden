"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiBox,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

interface Promotion {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
  description: string | null;
  applies_to: 'all' | 'specific_products' | 'specific_categories';
  product_ids: number[] | null;
  category_ids: number[] | null;
  requires_login: boolean;
  is_onetime: boolean;
  created_at: string;
}

export default function AdminPromotionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const itemsPerPage = 10;
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
  
  // Status update
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/promotions`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch promotions data
  useEffect(() => {
    if (user) {
      fetchPromotions();
    }
  }, [user, currentPage, activeFilter]);
  
  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const delaySearch = setTimeout(() => {
        fetchPromotions();
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm]);
  
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      
      // Start with base query
      let query = supabase
        .from('promotions')
        .select('*');
      
      // Add filters
      if (activeFilter !== 'all') {
        const isActive = activeFilter === 'active';
        query = query.eq('is_active', isActive);
      }
      
      if (searchTerm) {
        query = query.or(`code.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Get total count for pagination
      const { count, error: countError } = await query.count();
      
      if (countError) throw countError;
      
      setTotalPromotions(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      
      // Add pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setPromotions(data as Promotion[]);
      }
      
    } catch (err: any) {
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = async (id: number, isActive: boolean) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPromotions(prevPromotions => 
        prevPromotions.map(promotion => 
          promotion.id === id ? { ...promotion, is_active: isActive } : promotion
        )
      );
      
    } catch (err: any) {
      console.error('Error updating promotion status:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const openDeleteModal = (id: number) => {
    setPromotionToDelete(id);
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPromotionToDelete(null);
  };
  
  const handleDeleteConfirm = async () => {
    if (promotionToDelete === null) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionToDelete);
      
      if (error) throw error;
      
      // Update local state
      setPromotions(prevPromotions => 
        prevPromotions.filter(promotion => promotion.id !== promotionToDelete)
      );
      
      closeDeleteModal();
      
      // Refresh data if this was the last item on the page
      if (promotions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchPromotions();
      }
      
    } catch (err: any) {
      console.error('Error deleting promotion:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleActiveFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setActiveFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('admin.promotions.noEndDate');
    
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format discount value
  const formatDiscountValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return `$${promotion.value.toFixed(2)}`;
      case 'free_shipping':
        return t('admin.promotions.freeShipping');
      default:
        return '';
    }
  };
  
  // Check if promotion is expired
  const isExpired = (promotion: Promotion) => {
    if (!promotion.end_date) return false;
    
    const now = new Date();
    const endDate = new Date(promotion.end_date);
    
    return now > endDate;
  };
  
  // Check if promotion is scheduled for future
  const isScheduled = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    
    return now < startDate;
  };
  
  // Get status text and class
  const getStatusInfo = (promotion: Promotion) => {
    if (!promotion.is_active) {
      return {
        text: t('admin.promotions.inactive'),
        className: 'bg-gray-100 text-gray-800'
      };
    }
    
    if (isExpired(promotion)) {
      return {
        text: t('admin.promotions.expired'),
        className: 'bg-red-100 text-red-800'
      };
    }
    
    if (isScheduled(promotion)) {
      return {
        text: t('admin.promotions.scheduled'),
        className: 'bg-yellow-100 text-yellow-800'
      };
    }
    
    return {
      text: t('admin.promotions.active'),
      className: 'bg-green-100 text-green-800'
    };
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
          <div>
            <h1 className="text-2xl font-bold">{t('admin.promotions.title')}</h1>
            <p className="text-gray-600">{t('admin.promotions.subtitle')}</p>
          </div>
          
          <Link
            href={`/${language}/admin/promotions/add`}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            <FiPlus className="mr-2" />
            {t('admin.promotions.addPromotion')}
          </Link>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('admin.promotions.searchPlaceholder')}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div className="inline-flex shadow-sm rounded-md">
            <button
              onClick={() => handleActiveFilterChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeFilter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              {t('admin.promotions.allPromotions')}
            </button>
            <button
              onClick={() => handleActiveFilterChange('active')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'active'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              {t('admin.promotions.activePromotions')}
            </button>
            <button
              onClick={() => handleActiveFilterChange('inactive')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeFilter === 'inactive'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              {t('admin.promotions.inactivePromotions')}
            </button>
          </div>
        </div>
        
        {/* Promotions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.promotions.code')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.promotions.discount')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.promotions.validity')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.promotions.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.promotions.usage')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    </td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {t('admin.promotions.noPromotions')}
                    </td>
                  </tr>
                ) : (
                  promotions.map(promotion => {
                    const statusInfo = getStatusInfo(promotion);
                    
                    return (
                      <tr key={promotion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {promotion.code}
                            </span>
                            {promotion.description && (
                              <span className="text-xs text-gray-500">
                                {promotion.description}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`
                              mr-2 p-1 rounded-full
                              ${promotion.type === 'percentage' ? 'bg-purple-100 text-purple-800' : 
                                promotion.type === 'fixed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'}
                            `}>
                              {promotion.type === 'percentage' ? <FiPercent size={14} /> :
                               promotion.type === 'fixed' ? <FiDollarSign size={14} /> :
                               <FiTag size={14} />}
                            </div>
                            <span className="text-sm text-gray-900">
                              {formatDiscountValue(promotion)}
                            </span>
                            {promotion.min_purchase_amount && (
                              <span className="ml-2 text-xs text-gray-500">
                                {t('admin.promotions.minPurchase')}: ${promotion.min_purchase_amount}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiCalendar className="mr-1 text-gray-500" size={14} />
                              <span>{formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiUsers className="mr-2" size={14} />
                            <span>
                              {promotion.usage_count}
                              {promotion.usage_limit ? `/${promotion.usage_limit}` : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(promotion.id, !promotion.is_active)}
                              disabled={isUpdating}
                              className={`p-1 rounded-full ${
                                promotion.is_active 
                                  ? 'text-yellow-600 hover:bg-yellow-100' 
                                  : 'text-green-600 hover:bg-green-100'
                              }`}
                              title={promotion.is_active 
                                ? t('admin.promotions.deactivate') 
                                : t('admin.promotions.activate')}
                            >
                              {promotion.is_active 
                                ? <FiXCircle size={18} /> 
                                : <FiCheckCircle size={18} />}
                            </button>
                            <Link
                              href={`/${language}/admin/promotions/edit/${promotion.id}`}
                              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                              title={t('admin.common.edit')}
                            >
                              <FiEdit size={18} />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(promotion.id)}
                              disabled={isUpdating}
                              className="p-1 rounded-full text-red-600 hover:bg-red-100"
                              title={t('admin.common.delete')}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && promotions.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('admin.common.showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                {t('admin.common.to')}{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalPromotions)}
                </span>{' '}
                {t('admin.common.of')} <span className="font-medium">{totalPromotions}</span>{' '}
                {t('admin.promotions.results')}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('admin.promotions.deleteConfirmTitle')}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {t('admin.promotions.deleteConfirmText')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('admin.promotions.confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 