"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatter';
import { FiPackage, FiTruck, FiShield, FiTag } from 'react-icons/fi';

interface OrderSummaryProps {
  shippingCost: number;
  discountAmount?: number;
  promocode?: string | null;
  taxRate?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  shippingCost,
  discountAmount = 0,
  promocode = null,
  taxRate = 0.15, // 15% VAT in Saudi Arabia
}) => {
  const { t } = useTranslation();
  const { cart } = useCart();
  
  // Calculate cart subtotal
  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  // Calculate tax amount
  const taxAmount = (subtotal - discountAmount) * taxRate;
  
  // Calculate total
  const total = subtotal + shippingCost + taxAmount - discountAmount;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-1">{t('checkout.order_summary')}</h3>
        <p className="text-sm text-gray-600">{t('checkout.items_in_cart', { count: cart.items.length })}</p>
      </div>
      
      <div className="p-5 border-b border-gray-200">
        <div className="max-h-72 overflow-auto space-y-4 pr-2">
          {cart.items.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-start space-x-3">
              <div className="w-16 h-16 relative flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 bg-helden-purple text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl-md">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                {item.size && (
                  <p className="text-xs text-gray-500">{t('product.size')}: {item.size}</p>
                )}
                {item.color && (
                  <p className="text-xs text-gray-500">{t('product.color')}: {item.color}</p>
                )}
                <p className="text-sm font-medium mt-1">{formatPrice(item.product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-5 border-b border-gray-200 space-y-3">
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">{t('checkout.subtotal')}</div>
          <div className="text-sm font-medium">{formatPrice(subtotal)}</div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">{t('checkout.shipping')}</div>
          <div className="text-sm font-medium">{formatPrice(shippingCost)}</div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">{t('checkout.tax', { rate: Math.round(taxRate * 100) })}</div>
          <div className="text-sm font-medium">{formatPrice(taxAmount)}</div>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <div className="text-sm flex items-center">
              <FiTag className="mr-1" size={14} />
              {promocode 
                ? t('checkout.discount_with_code', { code: promocode }) 
                : t('checkout.discount')}
            </div>
            <div className="text-sm font-medium">-{formatPrice(discountAmount)}</div>
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="text-base font-semibold">{t('checkout.total')}</div>
            <div className="text-base font-semibold">{formatPrice(total)}</div>
          </div>
        </div>
      </div>
      
      <div className="p-5 bg-gray-50 space-y-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiTruck className="mr-2 text-helden-purple" size={16} />
          <span>{t('checkout.free_shipping_message')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <FiPackage className="mr-2 text-helden-purple" size={16} />
          <span>{t('checkout.easy_returns_message')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <FiShield className="mr-2 text-helden-purple" size={16} />
          <span>{t('checkout.secure_checkout_message')}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 