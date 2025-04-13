"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

export interface Product {
  id: string | number;
  title?: string;
  name?: string;
  price: number;
  images?: string[];
  image?: string;
  main_image?: string;
  rating?: string;
  reviews?: number;
  colors?: string[];
  sizes?: string[];
  discount?: number | null;
  category?: string;
  isNew?: boolean;
  stockStatus?: 'in-stock' | 'limited' | 'low' | 'out-of-stock';
  stockCount?: number;
  isBestseller?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();

  // Extract product title from title or name
  const productTitle = product.title || product.name || "Product";

  // Extract product image from various possible data sources
  const productImage = 
    product.images && product.images.length > 0 ? product.images[0] : 
    product.image ? product.image : 
    product.main_image ? product.main_image : 
    '/images/product-placeholder.jpg';

  // Calculate discounted price
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      title: productTitle,
      price: discountedPrice,
      image: productImage,
      quantity: 1,
    });
  };

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // In a real app, this would call an API to add/remove from wishlist
  };

  const handleQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    // In a real app, this would open a modal with product details
  };

  // Determine stock status text and color
  let stockText = t('products.inStock');
  let stockColorClass = "text-green-600 bg-green-50";
  
  if (product.stockStatus === 'out-of-stock') {
    stockText = t('products.outOfStock');
    stockColorClass = "text-red-500 bg-red-50";
  } else if (product.stockStatus === 'low') {
    // Handle low stock without complex template literal
    const lowStockText = t('products.lowStock');
    const leftText = t('common.left');
    stockText = `${lowStockText} (${product.stockCount || 5} ${leftText})`;
    stockColorClass = "text-orange-500 bg-orange-50";
  } else if (product.stockStatus === 'limited') {
    stockText = t('products.limitedStock');
    stockColorClass = "text-amber-500 bg-amber-50";
  }

  return (
    <motion.div
      className="group h-full rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-lg relative border border-transparent hover:border-helden-purple-light"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/${language}/products/${product.id}`} className="block h-full">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={productImage}
            alt={productTitle}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Status Badges */}
          <div className="absolute top-0 left-0 p-2 flex flex-col gap-2 z-10">
            {product.discount && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase shadow-sm">
                -{product.discount}%
              </div>
            )}
            
            {product.isNew && (
              <div className="bg-helden-purple text-white px-3 py-1 rounded-md text-xs font-bold uppercase shadow-sm animate-pulse">
                {t('common.new')}
              </div>
            )}
            
            {product.isBestseller && (
              <div className="bg-helden-gold text-helden-purple-dark px-3 py-1 rounded-md text-xs font-bold uppercase shadow-sm">
                {t('products.bestseller')}
              </div>
            )}
          </div>
          
          {/* Note about text in product images */}
          <div className="absolute bottom-0 right-0 left-0 bg-black/70 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            {language === 'ar' ? 'بعض النصوص على صور المنتجات هي جزء من التصميم الأصلي' : 'Some text on product images is part of the original design'}
          </div>
          
          {/* Quick action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
            <button
              onClick={toggleWishlist}
              className={`${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-helden-purple hover:bg-helden-purple hover:text-white'} h-8 w-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110`}
              aria-label="Add to wishlist"
            >
              <FiHeart size={16} />
            </button>
            
            <button
              onClick={handleQuickView}
              className="bg-white text-helden-purple hover:bg-helden-purple hover:text-white h-8 w-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
              aria-label="Quick view"
            >
              <FiEye size={16} />
            </button>
          </div>
          
          {/* Out of stock overlay */}
          {product.stockStatus === 'out-of-stock' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-bold uppercase tracking-wider shadow-lg">
                {t('products.outOfStock')}
              </span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button 
              onClick={handleAddToCart}
              className="btn-primary-sm flex items-center gap-1 bg-helden-purple hover:bg-helden-purple-dark text-white py-2 px-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={product.stockStatus === 'out-of-stock'}
            >
              <FiShoppingCart size={16} />
              <span>{t('product.addToCart')}</span>
            </button>
            
            <button 
              onClick={toggleWishlist}
              className={`h-9 w-9 rounded-full ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-helden-purple'} flex items-center justify-center transition-all duration-200 hover:bg-helden-purple hover:text-white shadow-md hover:scale-110`}
            >
              <FiHeart size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Category tag if available */}
          {product.category && (
            <div className="mb-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {product.category}
              </span>
            </div>
          )}
          
          <h3 className="font-medium text-gray-800 mb-2 text-base line-clamp-2 group-hover:text-helden-purple transition-colors">
            {productTitle}
          </h3>
          
          {/* Stock status indicator */}
          <div className={`text-xs px-2 py-1 rounded-md inline-block mb-2 ${stockColorClass}`}>
            {stockText}
          </div>
          
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex text-helden-gold">
                {Array(5).fill(null).map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${parseFloat(product.rating || "0") > i ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-500">({product.reviews || 0})</span>
            </div>
          )}
          
          <div className="mb-1 flex items-end space-x-2 rtl:space-x-reverse">
            <span className="text-lg font-semibold text-helden-purple-dark">
              {discountedPrice.toFixed(2)} {t('common.sar')}
            </span>
            
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                {product.price.toFixed(2)} {t('common.sar')}
              </span>
            )}
          </div>
          
          {/* Color options if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mb-2">
              {product.colors.slice(0, 3).map((color, i) => (
                <span 
                  key={i} 
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" 
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Size options if available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <span key={size} className="inline-block px-1.5 py-0.5 text-xs border border-gray-200 rounded-md hover:border-helden-purple-light hover:bg-gray-50 transition-colors">
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      
      {/* Quick view modal would be implemented here in a real application */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowQuickView(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end">
              <button onClick={() => setShowQuickView(false)} className="text-gray-500 hover:text-helden-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Quick view content would go here */}
            <p className="text-center text-gray-500 p-8">Quick view functionality would be implemented here in a real application</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard; 