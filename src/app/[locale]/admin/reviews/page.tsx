"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiStar
} from 'react-icons/fi';

interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  is_approved: boolean;
  product: {
    name: string;
    slug: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function AdminReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const itemsPerPage = 10;
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  
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
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/reviews`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch reviews data
  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user, currentPage, statusFilter, ratingFilter]);
  
  // Search filter
  useEffect(() => {
    if (searchTerm && reviews.length > 0) {
      const delaySearch = setTimeout(() => {
        fetchReviews();
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm]);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Start with base query
      let query = supabase
        .from('reviews')
        .select(`
          *,
          product:products (name, slug),
          profile:profiles (first_name, last_name, email)
        `);
      
      // Add filters
      if (statusFilter !== 'all') {
        const isApproved = statusFilter === 'approved';
        query = query.eq('is_approved', isApproved);
      }
      
      if (ratingFilter !== null) {
        query = query.eq('rating', ratingFilter);
      }
      
      if (searchTerm) {
        query = query.or(`product.name.ilike.%${searchTerm}%,profile.email.ilike.%${searchTerm}%,comment.ilike.%${searchTerm}%`);
      }
      
      // Get total count
      const { count, error: countError } = await query.count();
      
      if (countError) throw countError;
      
      setTotalReviews(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      
      // Add pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setReviews(data as Review[]);
      }
      
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = async (id: number, isApproved: boolean) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, is_approved: isApproved } : review
        )
      );
      
    } catch (err: any) {
      console.error('Error updating review status:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const openDeleteModal = (id: number) => {
    setReviewToDelete(id);
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };
  
  const handleDeleteConfirm = async () => {
    if (reviewToDelete === null) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewToDelete);
      
      if (error) throw error;
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewToDelete)
      );
      
      closeDeleteModal();
      
      // Refresh data if this was the last item on the page
      if (reviews.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchReviews();
      }
      
    } catch (err: any) {
      console.error('Error deleting review:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleStatusFilterChange = (status: 'all' | 'approved' | 'pending') => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleRatingFilterChange = (rating: number | null) => {
    setRatingFilter(rating);
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar 
        key={index} 
        className={`${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-4 h-4`} 
      />
    ));
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('admin.reviews.title')}</h1>
          <p className="text-gray-600">{t('admin.reviews.subtitle')}</p>
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
              placeholder={t('admin.reviews.searchPlaceholder')}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex shadow-sm rounded-md">
              <button
                onClick={() => handleStatusFilterChange('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  statusFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                {t('admin.reviews.allReviews')}
              </button>
              <button
                onClick={() => handleStatusFilterChange('approved')}
                className={`px-4 py-2 text-sm font-medium ${
                  statusFilter === 'approved'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-300`}
              >
                {t('admin.reviews.approved')}
              </button>
              <button
                onClick={() => handleStatusFilterChange('pending')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  statusFilter === 'pending'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-300`}
              >
                {t('admin.reviews.pending')}
              </button>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => handleRatingFilterChange(null)}
              >
                <FiFilter className="mr-2" />
                {ratingFilter ? `${ratingFilter} ${t('admin.reviews.stars')}` : t('admin.reviews.filterByRating')}
              </button>
              {ratingFilter !== null && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleRatingFilterChange(rating)}
                    >
                      <div className="flex items-center">
                        {renderStars(rating)}
                        <span className="ml-2">{rating} {t('admin.reviews.stars')}</span>
                      </div>
                    </button>
                  ))}
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                    onClick={() => handleRatingFilterChange(null)}
                  >
                    {t('admin.reviews.clearFilter')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.reviews.product')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.reviews.rating')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.reviews.customer')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.reviews.date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.reviews.status')}
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
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {t('admin.reviews.noReviews')}
                    </td>
                  </tr>
                ) : (
                  reviews.map(review => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <Link
                            href={`/${language}/product/${review.product.slug}`}
                            target="_blank"
                            className="text-sm font-medium text-gray-900 hover:underline"
                          >
                            {review.product.name}
                          </Link>
                          <Link
                            href={`/${language}/admin/products/edit/${review.product_id}`}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            ID: {review.product_id}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-700">{review.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {review.profile.first_name} {review.profile.last_name}
                          </span>
                          <Link
                            href={`/${language}/admin/customers/${review.user_id}`}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            {review.profile.email}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            review.is_approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {review.is_approved
                            ? t('admin.reviews.statusApproved')
                            : t('admin.reviews.statusPending')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(review.id, true)}
                            disabled={review.is_approved || isUpdating}
                            className={`p-1 rounded-full ${
                              review.is_approved
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={t('admin.reviews.approve')}
                          >
                            <FiCheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(review.id, false)}
                            disabled={!review.is_approved || isUpdating}
                            className={`p-1 rounded-full ${
                              !review.is_approved
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-yellow-600 hover:bg-yellow-100'
                            }`}
                            title={t('admin.reviews.reject')}
                          >
                            <FiXCircle size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(review.id)}
                            disabled={isUpdating}
                            className="p-1 rounded-full text-red-600 hover:bg-red-100"
                            title={t('admin.reviews.delete')}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Review details expanded view would go here */}
          
          {/* Pagination */}
          {!loading && reviews.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('admin.common.showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                {t('admin.common.to')}{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalReviews)}
                </span>{' '}
                {t('admin.common.of')} <span className="font-medium">{totalReviews}</span>{' '}
                {t('admin.reviews.results')}
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
              {t('admin.reviews.deleteConfirmTitle')}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {t('admin.reviews.deleteConfirmText')}
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
                {t('admin.reviews.confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 