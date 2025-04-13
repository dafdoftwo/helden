"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiStar, FiFilter, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import { mockProducts } from '@/models/product';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | string | null>(null);
  const { addToCart } = useCart();

  // Get all unique categories
  const uniqueCategories = Array.from(new Set(mockProducts.map(product => product.category)));
  const categories = ['all', ...uniqueCategories];

  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === activeCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'priceAsc') return a.price - b.price;
    if (sortOption === 'priceDesc') return b.price - a.price;
    if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortOption === 'bestseller') return (b.sold || 0) - (a.sold || 0);
    if (sortOption === 'discount') {
      // Sort by discount percentage (higher discount first)
      const discountA = a.discount_price ? (a.price - a.discount_price) / a.price : 0;
      const discountB = b.discount_price ? (b.price - b.discount_price) / b.price : 0;
      return discountB - discountA;
    }
    // Default: newest
    return 0;
  });

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: t(`products.items.${product.id}.name`),
      price: product.discount_price || product.price,
      image: product.image,
      quantity: 1,
      color: null,
      size: null
    });
  };

  // Animation variants for products
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">{t('products.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {activeCategory === 'all' 
            ? t('categories.about.abayas.description')
            : t(`categories.about.${activeCategory}.description`)}
        </p>
      </div>
      
      {/* Categories Pills - Horizontally scrollable on mobile */}
      <div className="mb-8 overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${
                activeCategory === category
                  ? 'bg-helden-purple text-white shadow-lg shadow-helden-purple/30'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category === 'all' 
                ? t('common.allProducts') 
                : t(`categories.${category}`)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Filters and Sort Bar */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {/* Filter Toggle Button (Mobile) */}
          <div className="flex items-center space-x-4 mb-4 lg:mb-0 w-full lg:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FiFilter />
              <span>{t('filters.filters')}</span>
              <FiChevronDown className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* View Mode - Grid or List */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-helden-purple text-white' : 'bg-white text-gray-700'}`}
                aria-label="Grid view"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-helden-purple text-white' : 'bg-white text-gray-700'}`}
                aria-label="List view"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative w-full lg:w-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none w-full lg:w-auto bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-helden-purple"
            >
              <option value="newest">{t('filters.sortBy.newest')}</option>
              <option value="priceAsc">{t('filters.sortBy.priceAsc')}</option>
              <option value="priceDesc">{t('filters.sortBy.priceDesc')}</option>
              <option value="bestseller">{t('filters.sortBy.bestseller')}</option>
              <option value="rating">{t('filters.sortBy.rating')}</option>
              <option value="discount">{t('filters.sortBy.discount')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiChevronDown />
            </div>
          </div>
        </div>
        
        {/* Expandable Filter Section */}
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {/* Add your detailed filter options here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">{t('filters.price')}</h3>
                {/* Price range slider would go here */}
                <div className="h-4 bg-gray-200 rounded-full">
                  <div className="h-full w-2/3 bg-gradient-to-r from-helden-purple to-pink-400 rounded-full"></div>
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>0 {t('common.currency')}</span>
                  <span>1000 {t('common.currency')}</span>
                </div>
              </div>
              
              {/* Size Filter */}
              <div>
                <h3 className="font-medium mb-2">{t('filters.size')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="px-3 py-1 border border-gray-300 rounded-md hover:border-helden-purple text-sm">
                      {t(`sizes.${size}`)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Filter */}
              <div>
                <h3 className="font-medium mb-2">{t('filters.color')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['#000000', '#ffffff', '#964B00', '#F5F5DC', '#D3D3D3'].map(color => (
                    <button 
                      key={color} 
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-helden-purple"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Apply/Clear Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                {t('filters.clearAll')}
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-helden-purple text-white rounded-lg hover:bg-helden-purple-dark transition-colors">
                {t('filters.apply')}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Products Display */}
      {sortedProducts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {sortedProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={productVariants}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Quick Action Buttons - Visible on Hover */}
                  <div className={`absolute top-4 right-4 flex flex-col space-y-2 z-10 transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button 
                      className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:bg-helden-purple hover:text-white transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <FiHeart />
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:bg-helden-purple hover:text-white transition-colors"
                      aria-label="Quick add to cart"
                    >
                      <FiShoppingBag />
                    </button>
                  </div>
                  
                  {/* Sale / New Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.discount_price && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {Math.round((product.price - product.discount_price) / product.price * 100)}% {t('discounts.off')}
                      </span>
                    )}
                    {product.new && (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {t('products.new')}
                      </span>
                    )}
                  </div>
                  
                  {/* Product Image with hover effect */}
                  <div className="relative h-72 overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      <Image
                        src={product.image}
                        alt={t(`products.items.${product.id}.name`)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ objectPosition: 'center top' }}
                      />
                      
                      {/* Second image for hover effect */}
                      {product.images && product.images.length > 1 && (
                        <div className={`absolute inset-0 transition-opacity duration-700 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
                          <Image
                            src={product.images[1]}
                            alt={t(`products.items.${product.id}.name`)}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                            style={{ objectPosition: 'center top' }}
                          />
                        </div>
                      )}
                    </Link>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5 relative">
                    {/* Category */}
                    <div className="text-xs text-gray-500 mb-1">{t(`categories.${product.category}`)}</div>
                    
                    {/* Product Name */}
                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 hover:text-helden-purple transition-colors">
                        {t(`products.items.${product.id}.name`)}
                      </h3>
                    </Link>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {product.discount_price ? (
                          <div className="flex items-center">
                            <span className="text-xl font-bold text-helden-purple mr-2">
                              {product.discount_price} {t('common.currency')}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {product.price} {t('common.currency')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {product.price} {t('common.currency')}
                          </span>
                        )}
                      </div>
                      
                      {/* View Details Button */}
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-helden-purple hover:underline"
                      >
                        {t('products.viewDetails')}
                      </Link>
                    </div>
                    
                    {/* Add to Cart Button - Full Width */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-4 bg-helden-purple hover:bg-helden-purple-dark text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 group"
                    >
                      <FiShoppingBag className="group-hover:animate-bounce" />
                      <span>{t('common.addToCart')}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-6">
              {sortedProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  variants={productVariants}
                  className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-64 h-64">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image}
                        alt={t(`products.items.${product.id}.name`)}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.discount_price && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round((product.price - product.discount_price) / product.price * 100)}% {t('discounts.off')}
                        </span>
                      )}
                      {product.new && (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {t('products.new')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                      {/* Category */}
                      <div className="text-sm text-gray-500 mb-1">{t(`categories.${product.category}`)}</div>
                      
                      {/* Product Name */}
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xl font-medium text-gray-900 mb-2 hover:text-helden-purple transition-colors">
                          {t(`products.items.${product.id}.name`)}
                        </h3>
                      </Link>
                      
                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                      )}
                      
                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {t(`products.items.${product.id}.description`)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Price */}
                      <div>
                        {product.discount_price ? (
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-helden-purple mr-2">
                              {product.discount_price} {t('common.currency')}
                            </span>
                            <span className="text-base text-gray-400 line-through">
                              {product.price} {t('common.currency')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {product.price} {t('common.currency')}
                          </span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-helden-purple hover:bg-helden-purple-dark text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                          <FiShoppingBag />
                          <span>{t('common.addToCart')}</span>
                        </button>
                        
                        <Link
                          href={`/products/${product.id}`}
                          className="border border-helden-purple text-helden-purple hover:bg-helden-purple hover:text-white px-6 py-2 rounded-lg transition-colors duration-300"
                        >
                          {t('products.viewDetails')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t('products.noProductsFound')}</h3>
            <p className="text-gray-600 mb-6">
              {t('products.tryDifferentFilters')}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setIsFilterOpen(false);
              }}
              className="bg-helden-purple text-white px-6 py-2 rounded-lg hover:bg-helden-purple-dark transition-colors"
            >
              {t('filters.clearAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 