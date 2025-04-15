"use client";

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/i18n';

const CartIcon: React.FC = () => {
  const { cart, setIsOpen } = useCart();
  const { t } = useTranslation();
  
  // Calculate the total number of items in the cart from cart.items
  const itemCount = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <button
      className="relative p-2 text-gray-600 hover:text-helden-purple-dark transition-colors"
      onClick={() => setIsOpen(true)}
      aria-label={t('common.cart')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      
      {/* Item count badge */}
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-helden-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon; 