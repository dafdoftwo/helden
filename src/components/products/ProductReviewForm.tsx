"use client";

import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';

interface ProductReviewFormProps {
  productId: string | number;
  onReviewSubmitted: () => void;
}

const ProductReviewForm: React.FC<ProductReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const { user, loading, signIn } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('reviews.loginRequired'));
      return;
    }
    
    if (rating === 0) {
      setError(t('reviews.ratingRequired'));
      return;
    }
    
    if (!title.trim()) {
      setError(t('reviews.titleRequired'));
      return;
    }
    
    if (!comment.trim()) {
      setError(t('reviews.commentRequired'));
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Here we would normally send the review to the server
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setFormStatus('success');
      
      // Notify parent component
      onReviewSubmitted();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(t('reviews.submitError'));
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user && !loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">{t('reviews.writeReview')}</h3>
        <p className="text-gray-600 mb-4">{t('reviews.loginPrompt')}</p>
        <button
          onClick={() => signIn('', '')}
          className="bg-helden-purple hover:bg-helden-purple-dark text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {t('auth.signIn')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{t('reviews.writeReview')}</h3>
      
      {formStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {t('reviews.submitSuccess')}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reviews.rating')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl focus:outline-none"
                aria-label={`${t('reviews.rateAs')} ${star}`}
              >
                <FiStar
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-helden-gold fill-current'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 self-center">
              {rating > 0 && `(${rating}/5)`}
            </span>
          </div>
        </div>
        
        {/* Review Title */}
        <div className="mb-4">
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
            {t('reviews.title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reviewTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-helden-purple"
            placeholder={t('reviews.titlePlaceholder')}
            required
          />
        </div>
        
        {/* Review Comment */}
        <div className="mb-4">
          <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-2">
            {t('reviews.comment')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reviewComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-helden-purple"
            placeholder={t('reviews.commentPlaceholder')}
            required
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              bg-helden-purple hover:bg-helden-purple-dark text-white font-medium py-2 px-6 rounded transition-colors
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? t('common.submitting') : t('reviews.submitReview')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductReviewForm; 