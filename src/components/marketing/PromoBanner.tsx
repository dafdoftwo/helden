"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { CouponCode } from './PromoPopup';

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  couponCode?: string;
  discount?: string;
  expiryDate?: string;
  position?: 'top' | 'bottom';
  theme?: 'primary' | 'secondary' | 'dark';
  fullWidth?: boolean;
  className?: string;
}

export default function PromoBanner({
  title,
  subtitle,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  couponCode,
  discount,
  expiryDate,
  position = 'top',
  theme = 'primary',
  fullWidth = false,
  className = ''
}: PromoBannerProps) {
  const { t, dir } = useTranslation();
  
  // Default values
  const bannerTitle = title || t('promo.bannerDefaultTitle');
  const bannerSubtitle = subtitle || t('promo.bannerDefaultSubtitle');
  const bannerDescription = description || t('promo.bannerDefaultDescription');
  const bannerCtaText = ctaText || t('promo.shopNow');
  const bannerCtaLink = ctaLink || '/products';
  
  // Theme-based styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'primary':
        return 'bg-gradient-to-r from-helden-purple to-helden-purple-light text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-800';
      case 'dark':
        return 'bg-gradient-to-r from-gray-900 to-gray-800 text-white';
      default:
        return 'bg-gradient-to-r from-helden-purple to-helden-purple-light text-white';
    }
  };
  
  // Position classes
  const positionClasses = position === 'top' 
    ? 'mb-8 rounded-b-lg' 
    : 'mt-8 rounded-t-lg';
  
  return (
    <div 
      className={`${getThemeClasses()} ${positionClasses} ${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} overflow-hidden shadow-lg ${className}`}
      dir={dir}
    >
      <div className="relative">
        {/* Background pattern or image if provided */}
        {imageUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              {bannerSubtitle && (
                <p className="text-sm font-medium md:text-base opacity-90">
                  {bannerSubtitle}
                </p>
              )}
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                {bannerTitle}
              </h2>
              {bannerDescription && (
                <p className="mt-1 max-w-2xl text-sm md:text-base opacity-90">
                  {bannerDescription}
                </p>
              )}
              
              {/* Coupon code if provided */}
              {couponCode && discount && (
                <div className="mt-4 max-w-xs">
                  <CouponCode 
                    code={couponCode} 
                    discount={discount} 
                    expiryDate={expiryDate}
                    className="border-white bg-white/20"
                  />
                </div>
              )}
            </div>
            
            {/* CTA Button */}
            {bannerCtaLink && bannerCtaText && (
              <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                <Link
                  href={bannerCtaLink}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                    ${theme === 'primary' || theme === 'dark' 
                      ? 'bg-white text-helden-purple hover:bg-gray-100' 
                      : 'bg-helden-purple text-white hover:bg-helden-purple-dark'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple`}
                >
                  {bannerCtaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini banner - more compact version for category pages
export function MiniPromoBanner({
  text,
  couponCode,
  ctaLink,
  className = ''
}: {
  text: string;
  couponCode?: string;
  ctaLink?: string;
  className?: string;
}) {
  const { t, dir } = useTranslation();
  
  return (
    <div 
      className={`bg-helden-purple text-white px-4 py-2 text-center text-sm ${className}`}
      dir={dir}
    >
      <span>{text}</span>
      {couponCode && (
        <span className="mx-2 font-mono font-bold bg-white/20 px-2 py-1 rounded">
          {couponCode}
        </span>
      )}
      {ctaLink && (
        <Link href={ctaLink} className="ml-2 underline font-medium hover:text-white/80">
          {t('promo.learnMore')}
        </Link>
      )}
    </div>
  );
} 