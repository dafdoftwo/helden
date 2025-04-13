"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCheckCircle, FiAlertTriangle, FiCreditCard, FiShield } from 'react-icons/fi';
import { useTranslation } from '@/i18n';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  type: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (methodId: string) => void;
  totalAmount: number;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  totalAmount
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  // تحقق من توفر Apple Pay (في البيئة الحقيقية)
  useEffect(() => {
    const checkApplePayAvailability = async () => {
      try {
        // في الإنتاج، ستستخدم دالة حقيقية للتحقق من توفر Apple Pay
        // هنا نستخدم تنفيذ مبسط للعرض التوضيحي
        
        const isAvailable = window.navigator.userAgent.includes('Mac') || 
                           window.navigator.userAgent.includes('iPhone') || 
                           window.navigator.userAgent.includes('iPad');
        
        setApplePayAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking Apple Pay availability:', error);
        setApplePayAvailable(false);
      }
    };

    checkApplePayAvailability();
  }, []);

  // جلب طرق الدفع المتاحة
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        // Instead of making an API call, we'll use mock data since we're just fixing image paths
        const methods = [
          {
            id: 'mada',
            name: 'مدى (Mada)',
            icon: '/images/payment/mada.svg',
            enabled: true,
            type: 'card',
            description: t('payment.mada_desc') || 'Pay securely with Mada cards'
          },
          {
            id: 'visa_mastercard',
            name: t('payment.credit_card') || 'Credit Card',
            icon: '/images/payment/visa.svg',
            enabled: true,
            type: 'card',
            description: t('payment.credit_card_desc') || 'Pay with Visa or Mastercard'
          },
          {
            id: 'apple_pay',
            name: 'Apple Pay',
            icon: '/images/payment/apple-pay.svg',
            enabled: applePayAvailable,
            type: 'wallet',
            description: t('payment.apple_pay_desc') || 'Quick and secure payments with Apple Pay'
          },
          {
            id: 'tabby',
            name: 'Tabby',
            icon: '/images/payment/tabby.png',
            enabled: true,
            type: 'bnpl',
            description: t('payment.bnpl_desc') || 'Pay in 4 interest-free installments'
          },
          {
            id: 'tamara',
            name: 'Tamara',
            icon: '/images/payment/tamara.png',
            enabled: true,
            type: 'bnpl',
            description: t('payment.bnpl_desc') || 'Pay in 4 interest-free installments'
          },
          {
            id: 'cod',
            name: t('payment.cash_on_delivery') || 'Cash On Delivery',
            icon: '/images/payment/cod.png',
            enabled: true,
            type: 'cod',
            description: t('payment.cod_desc') || 'Pay when you receive your order'
          }
        ];
        
        if (!applePayAvailable) {
          setPaymentMethods(methods.filter(method => method.id !== 'apple_pay'));
        } else {
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setError('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [applePayAvailable, t]);

  // تجميع طرق الدفع حسب النوع
  const paymentMethodsByType = paymentMethods.reduce((acc, method) => {
    if (!acc[method.type]) {
      acc[method.type] = [];
    }
    acc[method.type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  // أسماء أنواع طرق الدفع
  const typeNames: Record<string, string> = {
    card: t('payment.cardPayments'),
    wallet: t('payment.digitalWallets'),
    bnpl: t('payment.bnplOptions'),
    cod: t('payment.cashOptions')
  };

  // ترتيب أنواع طرق الدفع
  const typeOrder = ['card', 'wallet', 'bnpl', 'cod'];

  if (loading) {
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold mb-6">{t('checkout.paymentMethod')}</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">{t('checkout.paymentMethod')}</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <FiAlertTriangle className="text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-6">{t('checkout.paymentMethod')}</h3>
      
      {/* طرق الدفع مجمعة حسب النوع */}
      {typeOrder
        .filter(type => paymentMethodsByType[type]?.length > 0)
        .map(type => (
          <div key={type} className="mb-8">
            <h4 className="text-lg font-medium mb-4 text-gray-800">
              {typeNames[type]}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {paymentMethodsByType[type].map(method => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md
                    ${selectedMethod === method.id ? 'border-helden-purple bg-purple-50 shadow' : 'border-gray-200'}
                  `}
                  onClick={() => onSelect(method.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="relative w-12 h-8 flex-shrink-0 bg-white rounded flex items-center justify-center overflow-hidden">
                        <Image
                          src={method.icon}
                          alt={method.name}
                          width={48}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h5 className="font-medium">{method.name}</h5>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <FiCheckCircle className="text-helden-purple text-xl flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* عرض معلومات إضافية لطرق الدفع المحددة */}
                    <AnimatePresence>
                      {selectedMethod === method.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-100"
                        >
                          {method.id === 'bnpl' && (
                            <div className="text-sm">
                              <p className="text-gray-700">
                                {t('payment.totalAmount')}: {totalAmount.toFixed(2)} {t('common.sar')}
                              </p>
                              <p className="text-gray-700">
                                {t('payment.installmentAmount')}: {(totalAmount / 4).toFixed(2)} {t('common.sar')} × 4
                              </p>
                            </div>
                          )}
                          {(method.id === 'mada' || method.id === 'visa_mastercard') && (
                            <div className="text-sm text-gray-700 flex items-center">
                              <FiShield className="mr-1" /> 
                              {t('payment.securePayment')}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      
      {/* معلومات الدفع الآمن */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <FiShield className="text-helden-purple text-xl mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium mb-1 text-gray-900">{t('checkout.securePayment')}</h4>
            <p className="text-xs text-gray-600">
              {t('checkout.securePaymentInfo')}
            </p>
            <div className="mt-3 flex items-center space-x-4">
              <div className="h-6 relative w-20">
                <Image 
                  src="/images/payment/visa.svg" 
                  alt="PCI DSS" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-6 relative w-16">
                <Image 
                  src="/images/payment/mastercard.svg" 
                  alt="SSL" 
                  fill
                  className="object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 