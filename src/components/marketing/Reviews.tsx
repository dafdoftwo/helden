"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import { useUser } from '@/hooks/useUser';
import { useParams } from 'next/navigation';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_verified_purchase: boolean;
  is_recommended: boolean;
  likes_count: number;
  helpful_count: number;
}

interface ReviewProps {
  productId: string;
  initialReviews?: Review[];
  className?: string;
  maxReviews?: number;
  showSubmitForm?: boolean;
  averageRating?: number;
  totalReviews?: number;
}

export default function Reviews({
  productId,
  initialReviews,
  className = '',
  maxReviews = 5,
  showSubmitForm = true,
  averageRating,
  totalReviews
}: ReviewProps) {
  const { t, dir } = useTranslation();
  const params = useParams();
  const currentLocale = params.locale as string || 'en';
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [loading, setLoading] = useState(!initialReviews);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    averageRating: averageRating || 0,
    totalReviews: totalReviews || 0,
    ratingCounts: [0, 0, 0, 0, 0]
  });
  
  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    is_recommended: true
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  useEffect(() => {
    if (!initialReviews) {
      fetchReviews();
    }
    
    if (!averageRating || !totalReviews) {
      fetchReviewStats();
    }
  }, [productId]);
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(maxReviews);
        
      if (error) throw error;
      
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchReviewStats = async () => {
    try {
      // Get average rating and total count
      const { data: avgData, error: avgError } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId);
        
      if (avgError) throw avgError;
      
      if (avgData && avgData.length > 0) {
        const total = avgData.length;
        const sum = avgData.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / total;
        
        // Count ratings by star level
        const counts = [0, 0, 0, 0, 0];
        avgData.forEach(review => {
          const index = Math.floor(review.rating) - 1;
          if (index >= 0 && index < 5) {
            counts[index]++;
          }
        });
        
        setStats({
          averageRating: average,
          totalReviews: total,
          ratingCounts: counts
        });
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Validate form
    if (formData.rating === 0) {
      setFormError(t('reviews.errorRating'));
      return;
    }
    
    if (!formData.title.trim()) {
      setFormError(t('reviews.errorTitle'));
      return;
    }
    
    if (!formData.content.trim()) {
      setFormError(t('reviews.errorContent'));
      return;
    }
    
    if (!user) {
      setFormError(t('reviews.errorLogin'));
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Check if user already reviewed this product
      const { data: existingReview, error: checkError } = await supabase
        .from('product_reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single();
      
      // Get user's order history to check if they purchased this product
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, order_items!inner(product_id)')
        .eq('user_id', user.id)
        .eq('order_items.product_id', productId)
        .limit(1);
        
      const isVerifiedPurchase = orderData && orderData.length > 0;
      
      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from('product_reviews')
          .update({
            rating: formData.rating,
            title: formData.title,
            content: formData.content,
            is_recommended: formData.is_recommended,
            is_verified_purchase: isVerifiedPurchase,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);
          
        if (updateError) throw updateError;
        
        setFormSuccess(t('reviews.updateSuccess'));
      } else {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        // Create new review
        const { error: insertError } = await supabase
          .from('product_reviews')
          .insert({
            product_id: productId,
            user_id: user.id,
            name: profileData?.full_name || user.email?.split('@')[0] || 'Anonymous',
            avatar_url: profileData?.avatar_url,
            rating: formData.rating,
            title: formData.title,
            content: formData.content,
            is_recommended: formData.is_recommended,
            is_verified_purchase: isVerifiedPurchase,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
        
        setFormSuccess(t('reviews.submitSuccess'));
      }
      
      // Reset form after successful submission
      setFormData({
        rating: 0,
        title: '',
        content: '',
        is_recommended: true
      });
      
      // Reload reviews and stats
      fetchReviews();
      fetchReviewStats();
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setFormError(error.message || t('reviews.submitError'));
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: currentLocale === 'ar' ? ar : enUS
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Helper to render stars
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </button>
        ))}
      </div>
    );
  };
  
  // Calculate percentage for rating bars
  const getRatingPercentage = (count: number) => {
    if (stats.totalReviews === 0) return 0;
    return (count / stats.totalReviews) * 100;
  };
  
  return (
    <div className={`my-8 ${className}`} dir={dir}>
      <h2 className="text-2xl font-bold mb-6">{t('reviews.title')}</h2>
      
      {/* Stats Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap">
          {/* Average rating */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0 text-center">
            <div className="text-5xl font-bold text-helden-purple">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="mt-2">
              {renderStars(stats.averageRating)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {t('reviews.basedOn')} {stats.totalReviews} {t('reviews.reviews')}
            </div>
          </div>
          
          {/* Rating breakdown */}
          <div className="w-full md:w-2/3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-2">
                <div className="w-24 text-sm text-gray-600">
                  {star} {t('reviews.stars')}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${getRatingPercentage(stats.ratingCounts[star - 1])}%` }}
                  ></div>
                </div>
                <div className="w-10 text-xs text-gray-500 text-right">
                  {stats.ratingCounts[star - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Write review button */}
      {showSubmitForm && user && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-helden-purple hover:bg-helden-purple-dark text-white px-4 py-2 rounded-md"
            >
              {t('reviews.writeReview')}
            </button>
          ) : (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">{t('reviews.writeYourReview')}</h3>
              
              {formError && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-md">
                  {formSuccess}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reviews.rating')}
                  </label>
                  <div className="flex items-center">
                    {renderStars(formData.rating, true)}
                    <span className="ml-2 text-sm text-gray-500">
                      {formData.rating > 0 
                        ? `${formData.rating}/5 - ${
                            formData.rating >= 4 ? t('reviews.excellent') :
                            formData.rating >= 3 ? t('reviews.good') :
                            formData.rating >= 2 ? t('reviews.fair') : 
                            t('reviews.poor')
                          }`
                        : t('reviews.selectRating')
                      }
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reviews.reviewTitle')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    placeholder={t('reviews.titlePlaceholder')}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reviews.reviewContent')}
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={4}
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    placeholder={t('reviews.contentPlaceholder')}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_recommended"
                      name="is_recommended"
                      checked={formData.is_recommended}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                    />
                    <label htmlFor="is_recommended" className="ml-2 block text-sm text-gray-700">
                      {t('reviews.recommendProduct')}
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-helden-purple hover:bg-helden-purple-dark rounded-md disabled:opacity-50"
                  >
                    {submitting ? t('reviews.submitting') : t('reviews.submit')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      
      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-helden-purple"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {review.avatar_url ? (
                    <Image
                      src={review.avatar_url}
                      alt={review.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-helden-purple text-white rounded-full flex items-center justify-center">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{review.name}</h4>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                    {review.is_verified_purchase && (
                      <div className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                        {t('reviews.verifiedPurchase')}
                      </div>
                    )}
                  </div>
                  <h5 className="font-medium mt-2">{review.title}</h5>
                  <p className="text-gray-700 mt-1">
                    {review.content}
                  </p>
                  {review.is_recommended && (
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t('reviews.wouldRecommend')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="mt-2 text-gray-500">
            {t('reviews.noReviews')}
          </p>
          {showSubmitForm && user && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-helden-purple hover:bg-helden-purple-dark text-white px-4 py-2 rounded-md"
            >
              {t('reviews.beTheFirst')}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 