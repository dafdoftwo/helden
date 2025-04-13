"use client";

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/i18n/client';

const CartIcon = () => {
  // Try-catch to handle cases where CartContext might not be available
  try {
    const { cart, setIsOpen } = useCart();
    const { t } = useTranslation();
    
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
    
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 mr-2 text-gray-700 hover:text-helden-purple transition-colors focus:outline-none"
        aria-label={t('cart.title')}
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
        
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-helden-purple rounded-full">
            {itemCount}
          </span>
        )}
      </button>
    );
  } catch (error) {
    // Fallback to a simple cart icon without counter
    return (
      <button
        className="relative p-2 mr-2 text-gray-700 hover:text-helden-purple transition-colors focus:outline-none"
        aria-label="Cart"
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
      </button>
    );
  }
};

export default CartIcon; 