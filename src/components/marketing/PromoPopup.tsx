"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface PromoPopupProps {
  delay?: number; // Delay in milliseconds before showing the popup
  cookieExpiration?: number; // Days to remember user's dismiss choice
  promoId?: string; // Unique identifier for this promo
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  showNewsletter?: boolean;
  className?: string;
}

export default function PromoPopup({
  delay = 5000,
  cookieExpiration = 7,
  promoId = 'default-promo',
  title,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  showNewsletter = true,
  className = ''
}: PromoPopupProps) {
  const { t, dir } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Default values
  const popupTitle = title || t('promo.defaultTitle');
  const popupDescription = description || t('promo.defaultDescription');
  const popupImage = imageUrl || '/images/marketing/promo-default.jpg';
  const popupCtaText = ctaText || t('promo.defaultCta');
  const popupCtaLink = ctaLink || '/products';
  
  useEffect(() => {
    // Check if user has dismissed this popup before
    const checkDismissed = () => {
      const dismissedPromos = localStorage.getItem('dismissedPromos');
      if (dismissedPromos) {
        try {
          const promos = JSON.parse(dismissedPromos);
          return promos.includes(promoId);
        } catch (e) {
          return false;
        }
      }
      return false;
    };
    
    // Show popup after delay if it hasn't been dismissed
    if (!checkDismissed()) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [delay, promoId]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    
    // Save dismissal in localStorage
    try {
      const dismissedPromos = localStorage.getItem('dismissedPromos');
      let promos = dismissedPromos ? JSON.parse(dismissedPromos) : [];
      
      if (!promos.includes(promoId)) {
        promos.push(promoId);
        localStorage.setItem('dismissedPromos', JSON.stringify(promos));
      }
      
      // Set expiration
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + cookieExpiration);
      localStorage.setItem('promosExpiration', expirationDate.toISOString());
    } catch (e) {
      console.error('Error saving promo dismissal:', e);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset message
    setMessage(null);
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({
        type: 'error',
        text: t('newsletter.invalidEmail')
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (!existingSubscriber) {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email,
            name: '',
            subscribe_to_offers: true,
            subscribe_to_new_arrivals: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            source: `popup-${promoId}`
          });
        
        if (insertError) throw insertError;
      }
      
      setMessage({
        type: 'success',
        text: t('newsletter.subscribeSuccess')
      });
      
      // Clear form and dismiss after success
      setEmail('');
      setTimeout(() => {
        handleDismiss();
      }, 3000);
      
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setMessage({
        type: 'error',
        text: error.message || t('newsletter.error')
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={handleDismiss}
        ></div>
        
        {/* Modal panel */}
        <div 
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${className}`}
          dir={dir}
        >
          {/* Close button */}
          <button 
            type="button" 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleDismiss}
          >
            <span className="sr-only">{t('common.close')}</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="sm:flex sm:items-start">
            {/* Image */}
            {popupImage && (
              <div className="w-full sm:w-2/5">
                <div className="relative h-48 sm:h-full">
                  <Image
                    src={popupImage}
                    alt={popupTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${popupImage ? 'sm:w-3/5' : 'w-full'}`}>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {popupTitle}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {popupDescription}
                  </p>
                </div>
                
                {/* Newsletter signup form */}
                {showNewsletter && (
                  <div className="mt-4">
                    {message && (
                      <div className={`mb-4 p-2 text-sm rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label htmlFor="email" className="sr-only">
                          {t('newsletter.emailLabel')}
                        </label>
                        <input
                          type="email"
                          id="popup-email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('newsletter.emailPlaceholder')}
                          className="block w-full shadow-sm focus:ring-helden-purple focus:border-helden-purple sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-helden-purple hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple disabled:opacity-50"
                      >
                        {loading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                      </button>
                    </form>
                  </div>
                )}
                
                {/* CTA Button */}
                {popupCtaLink && popupCtaText && !showNewsletter && (
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Link
                      href={popupCtaLink}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-helden-purple text-base font-medium text-white hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleDismiss}
                    >
                      {popupCtaText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Coupon component that can be used independently
export function CouponCode({ code, discount, expiryDate, className = '' }: { 
  code: string; 
  discount: string;
  expiryDate?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className={`border border-dashed border-helden-purple rounded-md p-4 bg-purple-50 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">{t('promo.couponLabel')}</p>
          <div className="flex items-center mt-1">
            <span className="text-lg font-mono font-bold text-helden-purple">{code}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-2 text-helden-purple hover:text-helden-purple-dark"
            >
              {copied ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>
          {expiryDate && (
            <p className="text-xs text-gray-500 mt-1">
              {t('promo.expiryDate')}: {expiryDate}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{t('promo.discount')}</p>
          <p className="text-xl font-bold text-helden-purple">{discount}</p>
        </div>
      </div>
    </div>
  );
} 