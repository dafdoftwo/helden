"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';

// Enhanced featured products data with more details to improve engagement
const featuredProducts = [
  {
    id: 'abaya-01',
    nameKey: 'product.items.elegant_abaya.name',
    price: 599,
    image: '/images/Abayas/SaudiAbayas.jpg',
    category: 'abayas',
    discount: null,
    stock: 24,
    stockStatus: 'in-stock',
    isNew: false,
    rating: 4.8,
    reviewCount: 124,
    isBestseller: true,
  },
  {
    id: 'casual-02',
    nameKey: 'product.items.casual_clothes.name',
    price: 450,
    image: '/images/casual_clothes/Saudi_casual_clothes_1.jpg',
    category: 'casual',
    discount: null,
    stock: 32,
    stockStatus: 'in-stock',
    isNew: true,
    rating: 4.5,
    reviewCount: 86,
    isBestseller: false,
  },
  {
    id: 'formal-03',
    nameKey: 'product.items.formal_wear.name',
    price: 680,
    image: '/images/formal_wear/formal_wear_1.jpg',
    category: 'formal',
    discount: null,
    stock: 18,
    stockStatus: 'in-stock',
    isNew: false,
    rating: 4.7,
    reviewCount: 92,
    isBestseller: true,
  },
  {
    id: 'sports-04',
    nameKey: 'product.items.active_sports.name',
    price: 520,
    image: '/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg',
    category: 'sports',
    discount: 20,
    stock: 6,
    stockStatus: 'limited',
    isNew: false,
    rating: 4.9,
    reviewCount: 153,
    isBestseller: true,
  },
  {
    id: 'shaper-05',
    nameKey: 'product.items.contour_body_shaper.name',
    price: 320,
    image: '/images/women_body_shapers/women_body_shapers.jpg',
    category: 'body-shapers',
    discount: 10,
    stock: 3,
    stockStatus: 'low',
    isNew: false,
    rating: 4.6,
    reviewCount: 78,
    isBestseller: false,
  },
  {
    id: 'abaya-06',
    nameKey: 'product.items.luxury_gold_abaya.name',
    price: 890,
    image: '/images/Abayas/Saudi_Abayas2.jpg',
    category: 'abayas',
    discount: null,
    stock: 0,
    stockStatus: 'out-of-stock',
    isNew: true,
    rating: 4.9,
    reviewCount: 32,
    isBestseller: false,
  },
];

export default function FeaturedProducts() {
  const { t, language } = useTranslation();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null);
  
  // Function to get path with locale
  const getLocalizedHref = (path: string): string => {
    return language === 'en' ? `/${path}` : `/${language}/${path}`;
  };
  
  // Toggle wishlist status
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };
  
  // Get stock text and color based on stock status
  const getStockDisplay = (stockStatus: string) => {
    switch(stockStatus) {
      case 'out-of-stock':
        return { text: t('products.outOfStock'), color: 'text-red-500' };
      case 'low':
        return { text: t('products.lowStock'), color: 'text-orange-500' };
      case 'limited':
        return { text: t('products.limitedStock'), color: 'text-amber-500' };
      default:
        return { text: t('products.inStock'), color: 'text-green-600' };
    }
  };
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {featuredProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group-hover:translate-y-[-5px]">
              <div className="relative h-80 overflow-hidden">
                <Link href={getLocalizedHref(`products/${product.id}`)}>
                  <Image
                    src={product.image}
                    alt={t(product.nameKey)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
                
                {/* Product Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isNew && (
                    <span className="bg-helden-purple text-white text-xs font-bold uppercase py-1 px-2 rounded-md">
                      {t('products.new')}
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-helden-gold text-helden-purple-dark text-xs font-bold uppercase py-1 px-2 rounded-md">
                      {t('products.bestseller')}
                    </span>
                  )}
                </div>
                
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white font-bold text-sm uppercase py-1 px-3 rounded-md shadow-lg">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Product Actions */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={() => setQuickViewProduct(product.id)} 
                    className="bg-white hover:bg-helden-purple text-helden-purple hover:text-white p-2 rounded-full shadow-md transition-colors"
                    aria-label={t('products.quickView')}
                  >
                    <FiEye size={20} />
                  </button>
                  <button 
                    className="bg-white hover:bg-helden-purple text-helden-purple hover:text-white p-2 rounded-full shadow-md transition-colors"
                    aria-label={t('products.addToCart')}
                    disabled={product.stockStatus === 'out-of-stock'}
                  >
                    <FiShoppingBag size={20} />
                  </button>
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white text-helden-purple hover:bg-helden-purple hover:text-white'} p-2 rounded-full shadow-md transition-colors`}
                    aria-label={t('products.addToWishlist')}
                  >
                    <FiHeart size={20} />
                  </button>
                </div>
                
                {/* Stock Overlay for Out of Stock Products */}
                {product.stockStatus === 'out-of-stock' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white py-2 px-4 rounded-md font-bold uppercase tracking-wider">
                      {t('products.outOfStock')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase mb-1">{t(`categories.${product.category}`)}</p>
                
                {/* Product Name */}
                <Link href={getLocalizedHref(`products/${product.id}`)} className="block">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-helden-purple transition-colors mb-2 line-clamp-2">{t(product.nameKey)}</h3>
                </Link>
                
                {/* Ratings */}
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'text-helden-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 ml-2">{product.reviewCount} {t('products.reviews')}</span>
                </div>
                
                {/* Stock Status */}
                <p className={`text-xs ${getStockDisplay(product.stockStatus).color} mb-2`}>
                  {getStockDisplay(product.stockStatus).text}
                  {product.stockStatus === 'low' && ` (${product.stock} ${t('common.left')})`}
                </p>
                
                {/* Price */}
                <div className="flex justify-between items-center">
                  <div>
                    {product.discount ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-helden-purple-dark">
                          {Math.round(product.price * (1 - product.discount / 100))} {t('common.sar')}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.price} {t('common.sar')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-helden-purple-dark">
                        {product.price} {t('common.sar')}
                      </span>
                    )}
                  </div>
                  
                  {/* Add to Cart Button - Only for in-stock products */}
                  {product.stockStatus !== 'out-of-stock' && (
                    <button 
                      className="h-10 w-10 rounded-full bg-helden-purple-light hover:bg-helden-purple text-white flex items-center justify-center transition-colors shadow-sm hover:shadow"
                      aria-label={t('common.addToCart')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Quick View Modal - Would be implemented with proper functionality in a real app */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end">
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="text-gray-500 hover:text-helden-purple"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="relative h-96">
                <Image
                  src={featuredProducts.find(p => p.id === quickViewProduct)?.image || ''}
                  alt={t(featuredProducts.find(p => p.id === quickViewProduct)?.nameKey || '')}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {t(featuredProducts.find(p => p.id === quickViewProduct)?.nameKey || '')}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex text-helden-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="text-gray-600 ml-2">
                      ({featuredProducts.find(p => p.id === quickViewProduct)?.reviewCount} {t('products.reviews')})
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  {featuredProducts.find(p => p.id === quickViewProduct)?.discount ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-helden-purple-dark">
                        {Math.round((featuredProducts.find(p => p.id === quickViewProduct)?.price || 0) * (1 - ((featuredProducts.find(p => p.id === quickViewProduct)?.discount || 0) / 100)))} {t('common.sar')}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {featuredProducts.find(p => p.id === quickViewProduct)?.price} {t('common.sar')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-helden-purple-dark">
                      {featuredProducts.find(p => p.id === quickViewProduct)?.price} {t('common.sar')}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">
                  {t('products.quickViewDescription')}
                </p>
                
                <div className="flex space-x-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('products.size')}</label>
                    <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-helden-purple focus:border-transparent">
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('products.quantity')}</label>
                    <div className="flex border border-gray-300 rounded-md">
                      <button className="px-3 py-2 border-r border-gray-300">-</button>
                      <input type="text" value="1" readOnly className="w-12 text-center" />
                      <button className="px-3 py-2 border-l border-gray-300">+</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="flex-1 bg-helden-purple hover:bg-helden-purple-dark text-white font-bold py-3 px-4 rounded-md transition-colors">
                    {t('products.addToCart')}
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded-md transition-colors">
                    <FiHeart size={24} className="text-helden-purple" />
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link href={getLocalizedHref(`products/${quickViewProduct}`)} className="text-helden-purple hover:underline font-medium">
                    {t('products.viewFullDetails')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 