"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiStar, FiUser, FiThumbsUp, FiFlag } from 'react-icons/fi';
import { useTranslation } from '@/i18n';
import ProductReviewForm from './ProductReviewForm';

interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  helpful_count: number;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface ProductReviewsProps {
  productId: number;
  locale: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, locale }) => {
  const supabase = createClientComponentClient();
  const { t } = useTranslation();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Partial<Review> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: [0, 0, 0, 0, 0], // 1-5 stars
  });
  const [activeTab, setActiveTab] = useState<'helpful' | 'recent'>('helpful');
  const [reviewsUpdated, setReviewsUpdated] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        const isAuthenticated = !!sessionData.session?.user;
        setIsLoggedIn(isAuthenticated);
        
        if (isAuthenticated) {
          setCurrentUserId(sessionData.session?.user.id || null);
        }
        
        // Fetch reviews
        const { data: reviewsData, error } = await supabase
          .from('reviews')
          .select(`
            *,
            user:user_id (
              first_name,
              last_name,
              email
            )
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setReviews(reviewsData || []);
        
        // Calculate statistics
        if (reviewsData && reviewsData.length > 0) {
          const total = reviewsData.length;
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          const average = sum / total;
          
          // Count reviews by rating
          const counts = [0, 0, 0, 0, 0];
          reviewsData.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
              counts[review.rating - 1]++;
            }
          });
          
          setRatingStats({
            averageRating: average,
            totalReviews: total,
            ratingCounts: counts,
          });
          
          // Check if current user has already reviewed
          if (isAuthenticated) {
            const userReviewData = reviewsData.find(
              review => review.user_id === sessionData.session?.user.id
            );
            
            if (userReviewData) {
              setUserReview(userReviewData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId, supabase]);
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // Redirect to login page
      window.location.href = `/${locale}/auth/login?redirect=${window.location.pathname}`;
      return;
    }
    
    try {
      setSubmitting(true);
      
      const reviewData = {
        product_id: productId,
        user_id: currentUserId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        helpful_count: 0,
      };
      
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setReviews([data, ...reviews]);
        setUserReview(data);
        setShowReviewForm(false);
        
        // Update stats
        const newTotal = ratingStats.totalReviews + 1;
        const newSum = ratingStats.averageRating * ratingStats.totalReviews + newReview.rating;
        const newAverage = newSum / newTotal;
        
        const newCounts = [...ratingStats.ratingCounts];
        newCounts[newReview.rating - 1]++;
        
        setRatingStats({
          averageRating: newAverage,
          totalReviews: newTotal,
          ratingCounts: newCounts,
        });
        
        // Reset form
        setNewReview({
          rating: 5,
          title: '',
          comment: '',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleHelpful = async (reviewId: number) => {
    if (!isLoggedIn) {
      // Redirect to login page
      window.location.href = `/${locale}/auth/login?redirect=${window.location.pathname}`;
      return;
    }
    
    try {
      // First check if user already marked this review as helpful
      const { data: existingVote } = await supabase
        .from('review_helpful')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', currentUserId)
        .single();
      
      if (existingVote) {
        // User already voted, so remove their vote
        await supabase
          .from('review_helpful')
          .delete()
          .eq('id', existingVote.id);
        
        // Update the review's helpful count
        await supabase.rpc('decrement_helpful_count', {
          review_id_param: reviewId
        });
        
        // Update local state
        setReviews(reviews.map(review => 
          review.id === reviewId
            ? { ...review, helpful_count: review.helpful_count - 1 }
            : review
        ));
      } else {
        // Add new helpful vote
        await supabase
          .from('review_helpful')
          .insert({
            review_id: reviewId,
            user_id: currentUserId,
          });
        
        // Update the review's helpful count
        await supabase.rpc('increment_helpful_count', {
          review_id_param: reviewId
        });
        
        // Update local state
        setReviews(reviews.map(review => 
          review.id === reviewId
            ? { ...review, helpful_count: review.helpful_count + 1 }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${
              rating >= star
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } h-5 w-5 flex-shrink-0`}
          />
        ))}
      </div>
    );
  };
  
  const handleRatingChange = (newRating: number) => {
    setNewReview({ ...newReview, rating: newRating });
  };
  
  const renderRatingInput = () => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <FiStar
              className={`h-8 w-8 ${
                newReview.rating >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  // Function to reload reviews when a new review is submitted
  const handleReviewSubmitted = () => {
    setReviewsUpdated(prev => !prev);
  };
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">{t('reviews.customerReviews')}</h2>
      
      {/* Review Form */}
      <div className="mb-10">
        <ProductReviewForm 
          productId={productId} 
          onReviewSubmitted={handleReviewSubmitted} 
        />
      </div>
      
      {/* Reviews Tabs and List */}
      <section className="border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-900">{t('product.reviews')}</h2>
        
        {/* Rating Summary */}
        <div className="mt-6 bg-gray-50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  {ratingStats.averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-gray-500 ms-2">
                  / 5
                </span>
              </div>
              <div className="ms-4">
                {renderStars(ratingStats.averageRating)}
                <p className="text-sm text-gray-500 mt-1">
                  {t('product.basedOn')} {ratingStats.totalReviews} {t('product.reviews')}
                </p>
              </div>
            </div>
            
            {!userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-helden-purple hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple"
              >
                {t('product.writeReview')}
              </button>
            )}
          </div>
          
          {/* Rating Breakdown */}
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingStats.ratingCounts[rating - 1];
              const percentage = ratingStats.totalReviews > 0
                ? Math.round((count / ratingStats.totalReviews) * 100)
                : 0;
              
              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                    <FiStar className="ms-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 ms-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-medium text-gray-600">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="mt-10 space-y-8">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-helden-purple"></div>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ms-4">
                      <h4 className="text-sm font-bold text-gray-900">
                        {review.user?.first_name && review.user?.last_name
                          ? `${review.user.first_name} ${review.user.last_name}`
                          : review.user?.email?.split('@')[0] || t('product.anonymousUser')}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                
                <h5 className="mt-4 text-base font-semibold text-gray-900">{review.title}</h5>
                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                
                <div className="mt-4 flex space-x-4 items-center">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <FiThumbsUp className="h-4 w-4 me-1" />
                    {t('product.helpful')} ({review.helpful_count})
                  </button>
                  
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <FiFlag className="h-4 w-4 me-1" />
                    {t('product.report')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500">
              {t('product.noReviews')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductReviews; 