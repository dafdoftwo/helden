"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onToggle?: (isWishlisted: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = '',
  iconOnly = false,
  size = 'md',
  onToggle
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Check if product is in wishlist on mount
  useEffect(() => {
    // In a real app, you would get this from your wishlist state management
    const checkWishlistStatus = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.includes(productId));
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        setIsWishlisted(false);
      }
    };
    
    checkWishlistStatus();
  }, [productId]);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    // Toggle animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    // Toggle wishlist state
    const newStatus = !isWishlisted;
    setIsWishlisted(newStatus);
    
    // In a real app, you would update your wishlist in state management
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updatedWishlist = newStatus
        ? [...wishlist, productId]
        : wishlist.filter((id: string) => id !== productId);
      
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Call the onToggle callback if provided
      if (onToggle) {
        onToggle(newStatus);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };
  
  const sizesMap = {
    sm: { button: 'w-8 h-8', icon: 'w-3.5 h-3.5' },
    md: { button: 'w-10 h-10', icon: 'w-4.5 h-4.5' },
    lg: { button: 'w-12 h-12', icon: 'w-5.5 h-5.5' }
  };
  
  const { button: buttonSize, icon: iconSize } = sizesMap[size];
  
  return (
    <button
      type="button"
      onClick={toggleWishlist}
      className={`relative flex items-center justify-center focus:outline-none ${
        iconOnly
          ? `${buttonSize} rounded-full ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-gray-800'}`
          : `px-4 py-2 rounded-lg border ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'}`
      } transition-colors ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <FaHeart
          className={`${iconSize} ${isWishlisted ? 'fill-current' : 'fill-current opacity-80'}`}
        />
      </motion.div>
      
      {!iconOnly && (
        <span className="ml-2">
          {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton; 