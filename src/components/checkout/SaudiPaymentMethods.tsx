"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'card' | 'wallet' | 'bnpl' | 'bank' | 'cod';
}

interface SaudiPaymentMethodsProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const SaudiPaymentMethods: React.FC<SaudiPaymentMethodsProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const { t } = useTranslation();
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mada',
      name: 'مدى (Mada)',
      logo: '/images/payment/mada.svg',
      description: t('payment.mada_desc'),
      type: 'card',
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      logo: '/images/payment/apple-pay.svg',
      description: t('payment.apple_pay_desc'),
      type: 'wallet',
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      logo: '/images/payment/mada.svg',
      description: t('payment.stc_pay_desc'),
      type: 'wallet',
    },
    {
      id: 'tamara',
      name: 'Tamara',
      logo: '/images/payment/tamara.png',
      description: t('payment.tamara_desc'),
      type: 'bnpl',
    },
    {
      id: 'tabby',
      name: 'Tabby',
      logo: '/images/payment/tabby.png',
      description: t('payment.tabby_desc'),
      type: 'bnpl',
    },
    {
      id: 'visa_mastercard',
      name: t('payment.credit_card'),
      logo: '/images/payment/visa.svg',
      description: t('payment.credit_card_desc'),
      type: 'card',
    },
    {
      id: 'cod',
      name: t('payment.cash_on_delivery'),
      logo: '/images/payment/cod.png',
      description: t('payment.cod_desc'),
      type: 'cod',
    },
  ];
  
  // Group payment methods by type
  const groupedMethods: Record<string, PaymentMethod[]> = paymentMethods.reduce((acc, method) => {
    if (!acc[method.type]) {
      acc[method.type] = [];
    }
    acc[method.type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);
  
  // Payment method type labels
  const typeLabels: Record<string, string> = {
    card: t('payment.card_payments'),
    wallet: t('payment.digital_wallets'),
    bnpl: t('payment.buy_now_pay_later'),
    bank: t('payment.bank_transfers'),
    cod: t('payment.cash_options'),
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">{t('checkout.payment_method')}</h3>
      
      {Object.entries(groupedMethods).map(([type, methods]) => (
        <div key={type} className="mb-6">
          <h4 className="text-md font-medium mb-3 text-gray-700">{typeLabels[type]}</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {methods.map((method) => (
              <div
                key={method.id}
                onClick={() => onSelect(method.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedMethod === method.id
                    ? 'border-helden-purple bg-purple-50 shadow-sm'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 relative flex-shrink-0 bg-white rounded-md p-1 flex items-center justify-center">
                    <Image
                      src={method.logo}
                      alt={method.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium">{method.name}</h5>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium mb-2">{t('checkout.payment_security')}</h4>
        <p className="text-xs text-gray-600">
          {t('checkout.payment_security_message')}
        </p>
        <div className="mt-3 flex items-center space-x-4">
          <Image src="/images/payment/mada.svg" alt="PCI DSS" width={48} height={24} />
          <Image src="/images/payment/visa.svg" alt="SSL" width={48} height={24} />
          <Image src="/images/payment/mastercard.svg" alt="Norton" width={48} height={24} />
        </div>
      </div>
    </div>
  );
};

export default SaudiPaymentMethods; 