'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiFilter, FiGrid, FiList, FiChevronDown, FiX } from 'react-icons/fi';
import NewsletterSignup from '@/components/NewsletterSignup';

const categories = {
  'abayas': {
    name: 'عبايات',
    name_en: 'Abayas',
    description: 'مجموعة متنوعة من العبايات العصرية والأنيقة للمرأة السعودية',
    description_en: 'A diverse collection of modern and elegant abayas for Saudi women',
    image: '/images/categories/abayas-banner.jpg',
    color: 'from-purple-900 to-purple-800'
  },
  'casual': {
    name: 'ملابس كاجوال',
    name_en: 'Casual Wear',
    description: 'ملابس يومية مريحة وعصرية تناسب مختلف الأذواق',
    description_en: 'Comfortable and trendy everyday clothing for various tastes',
    image: '/images/categories/casual-banner.jpg',
    color: 'from-teal-800 to-teal-700'
  },
  'formal': {
    name: 'ملابس رسمية',
    name_en: 'Formal Wear',
    description: 'أناقة وفخامة مع تشكيلة متنوعة من الملابس الرسمية',
    description_en: 'Elegance and luxury with a varied collection of formal attire',
    image: '/images/categories/formal-banner.jpg',
    color: 'from-indigo-900 to-indigo-800'
  },
  'sportswear': {
    name: 'ملابس رياضية',
    name_en: 'Sportswear',
    description: 'ملابس رياضية عصرية لممارسة الرياضة بأناقة وراحة',
    description_en: 'Modern sportswear for exercising with elegance and comfort',
    image: '/images/categories/sportswear-banner.jpg',
    color: 'from-blue-800 to-blue-700'
  },
  'shapewear': {
    name: 'مشدات الجسم',
    name_en: 'Shapewear',
    description: 'مشدات حديثة لإبراز جمال قوامك بشكل مثالي',
    description_en: 'Modern shapewear to highlight your figure perfectly',
    image: '/images/categories/shapewear-banner.jpg',
    color: 'from-pink-900 to-pink-800'
  }
};

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'عباية كلاسيكية سوداء',
    nameEn: 'Classic Black Abaya',
    slug: 'classic-black-abaya',
    image: '/images/Abayas/Saudi_Abayas_1.jpg',
    price: 299.99,
    oldPrice: 450,
    category: 'abayas',
    inStock: true,
    isFeatured: true,
    isNew: false,
    isSale: true
  },
  {
    id: '2',
    name: 'عباية مطرزة فاخرة',
    nameEn: 'Luxury Embroidered Abaya',
    slug: 'luxury-embroidered-abaya',
    image: '/images/Abayas/Saudi_Abayas_2.jpg',
    price: 599.99,
    oldPrice: null,
    category: 'abayas',
    inStock: true,
    isFeatured: true,
    isNew: true,
    isSale: false
  },
  {
    id: '3',
    name: 'عباية كاجوال ملونة',
    nameEn: 'Casual Colored Abaya',
    slug: 'casual-colored-abaya',
    image: '/images/Abayas/Saudi_Abayas_3.jpg',
    price: 349.99,
    oldPrice: 499.99,
    category: 'abayas',
    inStock: true,
    isFeatured: false,
    isNew: true,
    isSale: true
  },
  {
    id: '4',
    name: 'تيشيرت قطني أساسي',
    nameEn: 'Basic Cotton T-shirt',
    slug: 'basic-cotton-tshirt',
    image: '/images/products/casual_1.jpg',
    price: 89.99,
    oldPrice: null,
    category: 'casual',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false
  },
  {
    id: '5',
    name: 'بنطلون جينز عصري',
    nameEn: 'Modern Jeans',
    slug: 'modern-jeans',
    image: '/images/products/casual_2.jpg',
    price: 199.99,
    oldPrice: 249.99,
    category: 'casual',
    inStock: true,
    isFeatured: true,
    isNew: false,
    isSale: true
  },
  {
    id: '6',
    name: 'بلوزة رسمية أنيقة',
    nameEn: 'Elegant Formal Blouse',
    slug: 'elegant-formal-blouse',
    image: '/images/products/formal_1.jpg',
    price: 249.99,
    oldPrice: null,
    category: 'formal',
    inStock: true,
    isFeatured: true,
    isNew: true,
    isSale: false
  },
  {
    id: '7',
    name: 'بدلة رسمية نسائية',
    nameEn: 'Women\'s Formal Suit',
    slug: 'womens-formal-suit',
    image: '/images/products/formal_2.jpg',
    price: 899.99,
    oldPrice: 1200,
    category: 'formal',
    inStock: true,
    isFeatured: true,
    isNew: false,
    isSale: true
  },
  {
    id: '8',
    name: 'ليقنز رياضي مريح',
    nameEn: 'Comfortable Sports Leggings',
    slug: 'comfortable-sports-leggings',
    image: '/images/products/sportswear_1.jpg',
    price: 149.99,
    oldPrice: null,
    category: 'sportswear',
    inStock: true,
    isFeatured: false,
    isNew: true,
    isSale: false
  },
  {
    id: '9',
    name: 'مشد خصر مطور',
    nameEn: 'Advanced Waist Trainer',
    slug: 'advanced-waist-trainer',
    image: '/images/products/shapewear_1.jpg',
    price: 199.99,
    oldPrice: 299.99,
    category: 'shapewear',
    inStock: true,
    isFeatured: true,
    isNew: false,
    isSale: true
  }
];

export default function CategoryPageClient({ params }: { params: { locale: string, slug: string } }) {
  const { t, dir } = useTranslation();
  const { slug } = params;
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState({
    onSale: false,
    newArrivals: false,
    inStock: false
  });
  
  const category = categories[slug as keyof typeof categories];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  useEffect(() => {
    // Simulate API call to fetch products
    const fetchProducts = async () => {
      setLoading(true);
      
      // Filter products by category
      const filteredProducts = mockProducts.filter(product => product.category === slug);
      
      // Apply sorting
      let sortedProducts = [...filteredProducts];
      
      switch (sortOption) {
        case 'priceDesc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'priceAsc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'newest':
          sortedProducts.sort((a, b) => a.isNew ? -1 : b.isNew ? 1 : 0);
          break;
        case 'discount':
          sortedProducts.sort((a, b) => {
            const discountA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
            const discountB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
            return discountB - discountA;
          });
          break;
        case 'featured':
        default:
          sortedProducts.sort((a, b) => a.isFeatured ? -1 : b.isFeatured ? 1 : 0);
          break;
      }
      
      // Apply filters
      if (selectedFilters.onSale) {
        sortedProducts = sortedProducts.filter(product => product.isSale);
      }
      
      if (selectedFilters.newArrivals) {
        sortedProducts = sortedProducts.filter(product => product.isNew);
      }
      
      if (selectedFilters.inStock) {
        sortedProducts = sortedProducts.filter(product => product.inStock);
      }
      
      // Apply price range
      sortedProducts = sortedProducts.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      setTimeout(() => {
        setProducts(sortedProducts);
        setLoading(false);
      }, 500);
    };
    
    fetchProducts();
  }, [slug, sortOption, selectedFilters, priceRange]);
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleFilterChange = (filterName: string, value: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };
  
  const handleToggleFavorite = (productId: string) => {
    // Handle toggling favorite status
    console.log('Toggle favorite for product', productId);
  };
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-helden-purple mb-4">
            {t('category.notFound') || 'Category not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('category.notFoundDesc') || 'The category you are looking for does not exist.'}
          </p>
          <Link 
            href="/"
            className="bg-helden-purple text-white px-6 py-3 rounded-full hover:bg-helden-purple-dark transition-colors"
          >
            {t('common.backHome') || 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter">
      {/* Hero Banner */}
      <div className={`relative h-80 sm:h-96 w-full bg-gradient-to-r ${category.color} overflow-hidden`}>
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          <Image
            src={category.image}
            alt={params.locale === 'ar' ? category.name : category.name_en}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-md">
            {params.locale === 'ar' ? category.name : category.name_en}
          </h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            {params.locale === 'ar' ? category.description : category.description_en}
          </p>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-helden-purple-dark border-b pb-3">
                {t('category.filters') || 'Filters'}
              </h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">
                  {t('category.priceRange') || 'Price Range'}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="number" 
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Min"
                    min="0"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Max"
                    min="0"
                  />
                </div>
                <button 
                  onClick={() => handlePriceChange(0, 1000)}
                  className="text-sm text-helden-purple hover:underline"
                >
                  {t('category.resetPrice') || 'Reset price'}
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <h3 className="font-medium mb-2 text-gray-700">
                  {t('category.productFilters') || 'Product Filters'}
                </h3>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedFilters.onSale}
                    onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    className="w-4 h-4 text-helden-purple rounded focus:ring-helden-purple"
                  />
                  <span>{t('category.onSale') || 'On Sale'}</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedFilters.newArrivals}
                    onChange={(e) => handleFilterChange('newArrivals', e.target.checked)}
                    className="w-4 h-4 text-helden-purple rounded focus:ring-helden-purple"
                  />
                  <span>{t('category.newArrivals') || 'New Arrivals'}</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedFilters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-helden-purple rounded focus:ring-helden-purple"
                  />
                  <span>{t('category.inStock') || 'In Stock'}</span>
                </label>
              </div>
            </div>
          </motion.aside>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden w-full sticky top-0 z-20 bg-white shadow-md p-3 flex justify-between items-center mb-4 rounded-lg">
            <button 
              onClick={toggleFilter}
              className="flex items-center gap-2 text-helden-purple font-medium"
            >
              <FiFilter />
              <span>{t('category.filters') || 'Filters'}</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <FiGrid />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <FiList />
              </button>
            </div>
          </div>
          
          {/* Mobile Filter Sidebar */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={toggleFilter}>
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ type: 'tween' }}
                className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl z-50 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 flex justify-between items-center border-b">
                  <h2 className="text-xl font-bold text-helden-purple">
                    {t('category.filters') || 'Filters'}
                  </h2>
                  <button onClick={toggleFilter}>
                    <FiX className="text-2xl" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="font-medium mb-3 text-gray-700">
                      {t('category.priceRange') || 'Price Range'}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="number" 
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Min"
                        min="0"
                      />
                      <span>-</span>
                      <input 
                        type="number" 
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Max"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h3 className="font-medium mb-2 text-gray-700">
                      {t('category.productFilters') || 'Product Filters'}
                    </h3>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedFilters.onSale}
                        onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                        className="w-4 h-4 text-helden-purple rounded"
                      />
                      <span>{t('category.onSale') || 'On Sale'}</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedFilters.newArrivals}
                        onChange={(e) => handleFilterChange('newArrivals', e.target.checked)}
                        className="w-4 h-4 text-helden-purple rounded"
                      />
                      <span>{t('category.newArrivals') || 'New Arrivals'}</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedFilters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="w-4 h-4 text-helden-purple rounded"
                      />
                      <span>{t('category.inStock') || 'In Stock'}</span>
                    </label>
                  </div>
                  
                  <button 
                    onClick={toggleFilter}
                    className="w-full py-3 bg-helden-purple text-white rounded-lg font-medium"
                  >
                    {t('common.apply') || 'Apply'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Products Section */}
          <div className="flex-1">
            {/* Sorting and View Mode - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  {t('category.sortBy') || 'Sort by:'}
                </span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="featured">{t('category.featured') || 'Featured'}</option>
                  <option value="priceAsc">{t('category.priceLowToHigh') || 'Price: Low to High'}</option>
                  <option value="priceDesc">{t('category.priceHighToLow') || 'Price: High to Low'}</option>
                  <option value="newest">{t('category.newest') || 'Newest'}</option>
                  <option value="discount">{t('category.discount') || 'Biggest Discount'}</option>
                </select>
                
                <div className="ml-4 text-gray-600">
                  {loading ? (
                    <span>{t('category.loading') || 'Loading...'}</span>
                  ) : (
                    <span>
                      {products.length} {t('category.products') || 'products'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FiGrid />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FiList />
                </button>
              </div>
            </div>
            
            {/* Sorting - Mobile */}
            <div className="lg:hidden flex items-center mb-4">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="featured">{t('category.sortByFeatured') || 'Sort by: Featured'}</option>
                <option value="priceAsc">{t('category.sortByPriceLow') || 'Sort by: Price - Low to High'}</option>
                <option value="priceDesc">{t('category.sortByPriceHigh') || 'Sort by: Price - High to Low'}</option>
                <option value="newest">{t('category.sortByNewest') || 'Sort by: Newest'}</option>
                <option value="discount">{t('category.sortByDiscount') || 'Sort by: Biggest Discount'}</option>
              </select>
            </div>
            
            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-helden-purple bg-opacity-10 rounded-full mb-6">
                  <FiShoppingBag className="text-3xl text-helden-purple" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('category.noProducts') || 'No products found'}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {t('category.noProductsDesc') || 'We couldn\'t find any products that match your criteria. Try adjusting your filters or check back later.'}
                </p>
                <button 
                  onClick={() => {
                    setSelectedFilters({ onSale: false, newArrivals: false, inStock: false });
                    setPriceRange([0, 1000]);
                    setSortOption('featured');
                  }}
                  className="bg-helden-purple text-white px-6 py-3 rounded-lg font-medium hover:bg-helden-purple-dark transition-colors"
                >
                  {t('category.resetFilters') || 'Reset all filters'}
                </button>
              </div>
            ) : (
              // Products Grid or List
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-6'
                }
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className={
                      viewMode === 'grid'
                        ? 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative'
                        : 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row relative'
                    }
                  >
                    {/* Product Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t('product.new') || 'New'}
                        </span>
                      )}
                      
                      {product.isSale && product.oldPrice && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleFavorite(product.id)}
                      className="absolute top-4 right-4 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-helden-purple-lighter transition-colors"
                      aria-label={t('product.addToFavorites') || 'Add to favorites'}
                    >
                      <FiHeart className="text-helden-purple" />
                    </button>
                    
                    {/* Product Image */}
                    <div 
                      className={
                        viewMode === 'grid'
                          ? 'relative h-60 sm:h-72 overflow-hidden'
                          : 'relative h-52 sm:h-auto sm:w-1/3 overflow-hidden'
                      }
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-helden-purple/5 to-helden-gold/5 z-0" />
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative w-full h-full overflow-hidden group">
                          <Image
                            src={product.image}
                            alt={params.locale === 'ar' ? product.name : product.nameEn}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                    </div>
                    
                    {/* Product Details */}
                    <div 
                      className={
                        viewMode === 'grid'
                          ? 'p-5'
                          : 'p-5 sm:w-2/3 flex flex-col justify-between'
                      }
                    >
                      <div>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-xl font-bold mb-2 hover:text-helden-purple transition-colors">
                            {params.locale === 'ar' ? product.name : product.nameEn}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-helden-purple">
                            {product.price.toLocaleString('ar-SA')} {t('common.sar') || 'ر.س'}
                          </span>
                          
                          {product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.oldPrice.toLocaleString('ar-SA')} {t('common.sar') || 'ر.س'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 bg-white border-2 border-helden-purple text-helden-purple font-medium rounded-full px-4 py-2 text-center hover:bg-helden-purple hover:text-white transition-colors duration-300"
                        >
                          {t('product.details') || 'Details'}
                        </Link>
                        
                        <button
                          disabled={!product.inStock}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2 font-medium text-center ${
                            !product.inStock
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-helden-purple text-white hover:bg-helden-purple-dark'
                          } transition-colors duration-300`}
                        >
                          <FiShoppingBag />
                          <span>{t('product.addToCart') || 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="mt-16 mb-20 px-4">
        <NewsletterSignup />
      </div>
    </main>
  );
} 