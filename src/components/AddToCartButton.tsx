"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useTranslation } from '../i18n';

interface AddToCartButtonProps {
  productId: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
  quantity?: number;
  productData?: {
    name: string;
    price: number;
    image: string;
    color?: string;
    size?: string;
  };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  showIcon = true,
  className = '',
  onClick,
  quantity = 1,
  productData
}) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const handleClick = () => {
    if (disabled) return;
    
    setIsAdding(true);
    
    // In a real app, you would add the product to the cart via your state management
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      
      // After showing the success state, reset to the original state
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
      
      // Call the onClick callback if provided
      if (onClick) {
        onClick();
      }
      
      // Store in localStorage for demo purposes
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = cartItems.findIndex((item: any) => 
          item.productId === productId && 
          item.color === productData?.color && 
          item.size === productData?.size
        );
        
        if (existingItemIndex >= 0) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push({
            productId,
            quantity,
            name: productData?.name,
            price: productData?.price,
            image: productData?.image,
            color: productData?.color,
            size: productData?.size,
            addedAt: new Date().toISOString()
          });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }, 800);
  };
  
  // Style variants
  const variantStyles = {
    primary: 'bg-helden-purple hover:bg-helden-purple-dark text-white',
    secondary: 'bg-helden-gold hover:bg-helden-gold/90 text-helden-purple-dark',
    outline: 'bg-transparent border border-helden-purple text-helden-purple hover:bg-helden-purple/5'
  };
  
  // Size variants
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6'
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isAdding}
      className={`
        relative flex items-center justify-center font-medium rounded-lg transition-all
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      aria-label={t('addToCart')}
    >
      {isAdding ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('adding')}
        </span>
      ) : isAdded ? (
        <motion.span 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center"
        >
          <FaCheck className="mr-1.5" />
          {t('addedToCart')}
        </motion.span>
      ) : (
        <span className="flex items-center">
          {showIcon && <FaShoppingCart className="mr-1.5" />}
          {t('addToCart')}
        </span>
      )}
      
      {/* Animation effect when adding to cart */}
      {isAdding && (
        <motion.div
          initial={{ scale: 0, borderRadius: '100%' }}
          animate={{ scale: 1.5, borderRadius: '100%', opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-helden-purple z-0"
        />
      )}
    </button>
  );
};

export default AddToCartButton; 