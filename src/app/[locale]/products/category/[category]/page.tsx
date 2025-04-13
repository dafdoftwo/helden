"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FilterSidebar } from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

// مصنف المنتجات لكل فئة
const CATEGORY_PRODUCTS = {
  'abayas': Array(12).fill(null).map((_, i) => ({
    id: `abaya-${i+1}`,
    title: `عباية فاخرة ${i+1}`,
    price: Math.floor(Math.random() * 1000) + 500,
    images: [`/images/Abayas/Saudi_Abayas_${(i % 3) + 1}.jpg`],
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 100),
    colors: ['#000000', '#392e3a', '#4a3636'],
    sizes: ['S', 'M', 'L', 'XL'],
    discount: i % 3 === 0 ? 15 : null,
  })),
  'casual': Array(10).fill(null).map((_, i) => ({
    id: `casual-${i+1}`,
    title: `ملابس كاجوال ${i+1}`,
    price: Math.floor(Math.random() * 400) + 200,
    images: [`/images/casual_clothes/Saudi_casual_clothes_${(i % 3) + 1}.jpg`],
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 120),
    colors: ['#f5f5dc', '#d3d3d3', '#ffb6c1'],
    sizes: ['S', 'M', 'L', 'XL'],
    discount: i % 4 === 0 ? 20 : null,
  })),
  'formal': Array(8).fill(null).map((_, i) => ({
    id: `formal-${i+1}`,
    title: `ملابس رسمية ${i+1}`,
    price: Math.floor(Math.random() * 700) + 400,
    images: [`/images/formal_wear/formal_wear_${(i % 3) + 1}.jpg`],
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 90),
    colors: ['#000000', '#800020', '#0f0f0f'],
    sizes: ['S', 'M', 'L', 'XL'],
    discount: i % 5 === 0 ? 10 : null,
  })),
  'sports': Array(9).fill(null).map((_, i) => ({
    id: `sports-${i+1}`,
    title: `ملابس رياضية ${i+1}`,
    price: Math.floor(Math.random() * 300) + 150,
    images: ['/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg'],
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 150),
    colors: ['#ff69b4', '#4b0082', '#00ced1', '#000000'],
    sizes: ['S', 'M', 'L', 'XL'],
    discount: i % 3 === 0 ? 25 : null,
  })),
  'body-shapers': Array(6).fill(null).map((_, i) => ({
    id: `body-shaper-${i+1}`,
    title: `مشد تنحيف ${i+1}`,
    price: Math.floor(Math.random() * 200) + 100,
    images: ['/images/body_shapper.jpg'],
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 200),
    colors: ['#f5f5dc', '#000000', '#d3d3d3'],
    sizes: ['S', 'M', 'L', 'XL'],
    discount: i % 2 === 0 ? 30 : null,
  })),
};

// ترجمة أسماء الفئات
const CATEGORY_TRANSLATIONS = {
  'en': {
    'abayas': 'Abayas',
    'casual': 'Casual Wear',
    'formal': 'Formal Wear',
    'sports': 'Sportswear',
    'body-shapers': 'Body Shapers',
  },
  'ar': {
    'abayas': 'عبايات',
    'casual': 'ملابس كاجوال',
    'formal': 'ملابس رسمية',
    'sports': 'ملابس رياضية',
    'body-shapers': 'مشدات تنحيف',
  },
};

// صور خلفية الفئات
const CATEGORY_BANNERS = {
  'abayas': '/images/banners/abayas-banner.jpg',
  'casual': '/images/banners/casual-banner.jpg',
  'formal': '/images/banners/formal-banner.jpg',
  'sports': '/images/banners/sports-banner.jpg',
  'body-shapers': '/images/banners/shapers-banner.jpg',
};

export default function CategoryPage({ params }: { params: { category: string, locale: string } }) {
  const { t, language } = useTranslation();
  const [products, setProducts] = useState(CATEGORY_PRODUCTS[params.category] || []);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  
  const categoryName = CATEGORY_TRANSLATIONS[language][params.category] || params.category;
  const categoryBanner = CATEGORY_BANNERS[params.category] || '/images/banners/default-banner.jpg';

  // تطبيق الفلاتر والترتيب على المنتجات
  useEffect(() => {
    let filteredProducts = [...CATEGORY_PRODUCTS[params.category] || []];
    
    // تطبيق فلتر السعر
    filteredProducts = filteredProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // تطبيق فلتر المقاسات
    if (selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => product.sizes.some(size => selectedSizes.includes(size))
      );
    }
    
    // تطبيق فلتر الألوان
    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => product.colors.some(color => selectedColors.includes(color))
      );
    }
    
    // تطبيق الترتيب
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'bestseller':
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'discount':
        filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'newest':
      default:
        // الترتيب الإفتراضي هو الأحدث
        break;
    }
    
    setProducts(filteredProducts);
  }, [params.category, sortBy, priceRange, selectedSizes, selectedColors]);

  return (
    <div className="min-h-screen">
      {/* بانر الفئة */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image 
          src={categoryBanner}
          alt={categoryName}
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.h1 
            className="text-4xl md:text-6xl font-semibold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {categoryName}
          </motion.h1>
          <motion.div
            className="w-24 h-1 bg-helden-gold-DEFAULT rounded"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
        </div>
      </div>
      
      {/* محتوى الصفحة */}
      <div className="container mx-auto px-4 py-8">
        {/* مسار التنقل */}
        <Breadcrumb
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.shop'), href: `/${language}/products` },
            { label: categoryName, href: `/${language}/products/category/${params.category}` },
          ]}
          className="mb-6"
        />
        
        {/* رأس القسم مع الفلاتر */}
        <div className="flex flex-wrap items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-3 md:mb-0">
            {products.length} {t('products.items')}
          </h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline-secondary flex items-center gap-2"
            >
              <FiFilter />
              {t('filters.filters')}
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-helden-purple-light focus:border-transparent"
              >
                <option value="newest">{t('filters.sortBy.newest')}</option>
                <option value="price-asc">{t('filters.sortBy.priceAsc')}</option>
                <option value="price-desc">{t('filters.sortBy.priceDesc')}</option>
                <option value="bestseller">{t('filters.sortBy.bestseller')}</option>
                <option value="rating">{t('filters.sortBy.rating')}</option>
                <option value="discount">{t('filters.sortBy.discount')}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-helden-purple-light text-white' : 'bg-white text-gray-600'}`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-helden-purple-light text-white' : 'bg-white text-gray-600'}`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* محتوى المنتجات مع الفلاتر */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* شريط الفلاتر */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            className={`md:w-1/4 lg:w-1/5 ${showFilters ? 'block' : 'hidden md:block'}`}
          />
          
          {/* عرض المنتجات */}
          <div className={`flex-1 ${showFilters ? 'hidden md:block' : 'block'}`}>
            {products.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                      <div className="relative h-60 sm:h-auto sm:w-1/3 md:w-1/4">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        {product.discount && (
                          <div className="absolute top-2 left-2 bg-helden-gold-DEFAULT text-white px-2 py-1 rounded-sm text-sm font-medium">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{product.title}</h3>
                          <div className="flex items-center mt-2">
                            <div className="flex text-helden-gold-DEFAULT">
                              {Array(5).fill(null).map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${parseFloat(product.rating) > i ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-gray-600 text-sm">({product.reviews})</span>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {product.colors.map((color, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                            ))}
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                              <span key={size} className="px-2 py-1 text-xs border border-gray-300 rounded">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap items-center justify-between">
                          <div>
                            {product.discount ? (
                              <div className="flex items-center">
                                <span className="text-xl font-semibold text-helden-purple-dark">
                                  {(product.price * (1 - product.discount / 100)).toFixed(2)} {t('common.sar')}
                                </span>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {product.price.toFixed(2)} {t('common.sar')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-semibold text-helden-purple-dark">
                                {product.price.toFixed(2)} {t('common.sar')}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-3 sm:mt-0">
                            <Link href={`/${language}/products/${product.id}`} 
                              className="btn-primary"
                            >
                              {t('common.viewDetails')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Image
                  src="/images/empty-results.svg"
                  alt="No products found"
                  width={200}
                  height={200}
                  className="mx-auto mb-6"
                />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {t('products.noResults')}
                </h3>
                <p className="text-gray-600">
                  {t('products.tryDifferentFilters')}
                </p>
                <button
                  onClick={() => {
                    setPriceRange([0, 2000]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setSortBy('newest');
                  }}
                  className="mt-4 btn-outline-primary"
                >
                  {t('filters.clearAll')}
                </button>
              </div>
            )}
            
            {/* ترقيم الصفحات */}
            {products.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button className="h-10 w-10 rounded-md bg-helden-purple-DEFAULT text-white flex items-center justify-center">1</button>
                  <button className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100">2</button>
                  <button className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100">3</button>
                  <button className="h-10 px-2 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100">...</button>
                  <button className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100">10</button>
                  <button className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* قسم المزيد من المعلومات */}
      <section className="bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-8">{t(`categories.about.${params.category}.title`)}</h2>
          <div className="max-w-3xl mx-auto prose prose-helden">
            <p className="text-gray-600 text-center">
              {t(`categories.about.${params.category}.description`, {
                defaultValue: t('categories.about.default')
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 