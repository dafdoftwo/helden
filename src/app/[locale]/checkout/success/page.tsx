"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiShoppingBag, FiTruck } from 'react-icons/fi';

export default function SuccessPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        if (sessionId) {
          // If we have a Stripe session ID, fetch details from our API
          const response = await fetch(`/api/checkout/success?session_id=${sessionId}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch order details');
          }
          
          setOrderDetails(data);
        } else if (orderId) {
          // If we have an order ID (from COD checkout), set basic details
          setOrderDetails({
            success: true,
            orderId,
            paymentMethod: 'cod'
          });
        } else {
          throw new Error('No session ID or order ID provided');
        }
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [sessionId, orderId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple mx-auto"></div>
            <h1 className="mt-6 text-xl font-semibold text-gray-900">{t('checkout.processingOrder')}</h1>
            <p className="mt-2 text-gray-600">{t('checkout.pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <FiCheck className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="mt-6 text-xl font-semibold text-gray-900">{t('checkout.orderError')}</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-block bg-helden-purple text-white px-4 py-2 rounded-md font-medium hover:bg-helden-purple-dark transition-colors"
              >
                {t('checkout.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <FiCheck className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('checkout.orderConfirmed')}</h1>
            <p className="mt-2 text-gray-600">
              {t('checkout.thankYou')}
            </p>
            
            {orderDetails && (
              <div className="mt-6 text-left border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.orderDetails')}</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('checkout.orderNumber')}</span>
                    <span className="font-medium">#{orderId || orderDetails.session?.id.slice(-8)}</span>
                  </div>
                  
                  {orderDetails.session?.payment_status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('checkout.paymentStatus')}</span>
                      <span className="font-medium capitalize">{orderDetails.session.payment_status}</span>
                    </div>
                  )}
                  
                  {orderDetails.session?.amount_total && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('checkout.total')}</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('ar-SA', {
                          style: 'currency',
                          currency: 'SAR'
                        }).format(orderDetails.session.amount_total / 100)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('checkout.paymentMethod')}</span>
                    <span className="font-medium">
                      {orderDetails.paymentMethod === 'cod'
                        ? t('checkout.cashOnDelivery')
                        : t('checkout.card')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex flex-col space-y-3">
              <div className="inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-helden-purple hover:bg-helden-purple-dark">
                <FiTruck className="mr-2" />
                {t('checkout.trackOrder')}
              </div>
              
              <Link 
                href="/"
                className="inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiShoppingBag className="mr-2" />
                {t('checkout.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}