"use client";

import React from 'react';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';

export default function CheckoutCancelPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t('checkout.checkoutCancelled')}</h1>
        
        <div className="flex justify-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <p className="text-lg mb-8">{t('checkout.checkoutCancelledMessage')}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/${locale}/checkout`}
            className="px-6 py-3 bg-helden-purple text-white font-medium rounded-md hover:bg-helden-purple-dark transition-colors inline-block"
          >
            {t('checkout.tryAgain')}
          </Link>
          
          <Link 
            href={`/${locale}/products`}
            className="px-6 py-3 border border-helden-purple text-helden-purple font-medium rounded-md hover:bg-gray-50 transition-colors inline-block"
          >
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
} 