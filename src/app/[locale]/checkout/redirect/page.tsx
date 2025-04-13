"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';

export default function PaymentRedirectPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  
  const provider = searchParams.get('provider');
  const mock = searchParams.get('mock');
  const reference = searchParams.get('reference') || generateOrderId();
  const success = searchParams.get('success') || 'true';
  
  function generateOrderId() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  useEffect(() => {
    async function processPayment() {
      try {
        if (provider === 'tabby' || provider === 'tamara') {
          if (success === 'true' || mock === 'true') {
            // For demonstration purposes, we're automatically accepting all payments
            // In a real implementation, you would verify the payment with the provider's API
            
            // Clear cart on successful payment
            clearCart();
            
            // Redirect to success page
            router.replace(`/${params.locale}/checkout/success?order_id=${reference}`);
          } else {
            // Payment was canceled or failed
            setStatus('error');
            setMessage(t('checkout.paymentFailed'));
            
            // After a short delay, redirect to checkout page
            setTimeout(() => {
              router.replace(`/${params.locale}/checkout?error=payment_failed`);
            }, 3000);
          }
        } else {
          // Unknown payment provider
          setStatus('error');
          setMessage(t('checkout.unknownPaymentProvider'));
          
          // After a short delay, redirect to checkout page
          setTimeout(() => {
            router.replace(`/${params.locale}/checkout`);
          }, 3000);
        }
      } catch (err) {
        console.error('Payment processing error:', err);
        setStatus('error');
        setMessage(t('checkout.paymentProcessingError'));
        
        // After a short delay, redirect to checkout page
        setTimeout(() => {
          router.replace(`/${params.locale}/checkout?error=processing_error`);
        }, 3000);
      }
    }
    
    processPayment();
  }, [provider, success, mock, reference, router, params.locale, clearCart, t]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple mx-auto"></div>
            <h1 className="mt-6 text-xl font-semibold text-gray-900">{t('checkout.processingPayment')}</h1>
            <p className="mt-2 text-gray-600">{t('checkout.pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-6 text-xl font-semibold text-gray-900">{t('checkout.paymentError')}</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">{t('checkout.redirecting')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
} 