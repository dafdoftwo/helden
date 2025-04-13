"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function FavoritesPage() {
  const { t } = useTranslation();
  
  // بيانات المنتجات المفضلة (يمكن استبدالها بمصدر بيانات حقيقي)
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      name: 'فستان سهرة أنيق',
      slug: 'elegant-evening-dress',
      image: '/images/products/product-1.jpg',
      price: 499.99,
      oldPrice: 650,
      category: 'فساتين',
      stockStatus: 'in-stock'
    },
    {
      id: '2',
      name: 'بلوزة كاجوال',
      slug: 'casual-blouse',
      image: '/images/products/product-2.jpg',
      price: 189.99,
      oldPrice: null,
      category: 'بلوزات',
      stockStatus: 'in-stock'
    },
    {
      id: '3',
      name: 'حذاء رياضي',
      slug: 'sport-shoes',
      image: '/images/products/product-3.jpg',
      price: 320,
      oldPrice: 399.99,
      category: 'أحذية',
      stockStatus: 'low-stock'
    },
    {
      id: '4',
      name: 'حقيبة يد فاخرة',
      slug: 'luxury-handbag',
      image: '/images/products/product-4.jpg',
      price: 799.99,
      oldPrice: null,
      category: 'حقائب',
      stockStatus: 'out-of-stock'
    }
  ]);

  // تكوين الحركات
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // وظيفة إزالة منتج من المفضلة
  const removeFromFavorites = (productId: string) => {
    setFavorites(favorites.filter(product => product.id !== productId));
  };
  
  // وظيفة للحصول على نص حالة المخزون
  const getStockStatusText = (status: string) => {
    switch(status) {
      case 'in-stock':
        return t('product.inStock') || 'متوفر';
      case 'low-stock':
        return t('product.lowStock') || 'كمية محدودة';
      case 'out-of-stock':
        return t('product.outOfStock') || 'نفذت الكمية';
      default:
        return '';
    }
  };
  
  // وظيفة للحصول على لون حالة المخزون
  const getStockStatusColor = (status: string) => {
    switch(status) {
      case 'in-stock':
        return 'bg-green-500';
      case 'low-stock':
        return 'bg-yellow-500';
      case 'out-of-stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // منتجات موصى بها
  const recommendedProducts = [
    {
      id: '5',
      name: 'تنورة قصيرة أنيقة',
      slug: 'elegant-short-skirt',
      image: '/images/products/product-5.jpg',
      price: 199.99,
      category: 'تنانير'
    },
    {
      id: '6',
      name: 'سترة شتوية دافئة',
      slug: 'warm-winter-jacket',
      image: '/images/products/product-6.jpg',
      price: 499.99,
      category: 'معاطف'
    },
    {
      id: '7',
      name: 'قميص رسمي',
      slug: 'formal-shirt',
      image: '/images/products/product-7.jpg',
      price: 249.99,
      category: 'قمصان'
    },
    {
      id: '8',
      name: 'فستان صيفي',
      slug: 'summer-dress',
      image: '/images/products/product-8.jpg',
      price: 279.99,
      category: 'فساتين'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-helden-purple-light via-white to-helden-gold-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-helden-purple to-helden-gold bg-clip-text text-transparent mb-4"
          >
            {t('favorites.title') || 'قائمة المفضلة'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {t('favorites.subtitle') || 'منتجاتك المفضلة في مكان واحد. تسوقي بسرعة وسهولة أو احتفظي بالمنتجات لمشاهدتها لاحقًا.'}
          </motion.p>
        </div>

        {/* قائمة المفضلة */}
        {favorites.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
                >
                  {/* زر الإزالة من المفضلة */}
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center z-10 hover:bg-red-50 transition-colors"
                    aria-label={t('favorites.remove') || 'إزالة من المفضلة'}
                  >
                    <FiX className="text-red-500" />
                  </button>
                  
                  {/* صورة المنتج */}
                  <div className="relative h-64">
                    <div className="absolute inset-0 bg-gradient-to-r from-helden-purple/5 to-helden-gold/5 z-0" />
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative w-full h-full overflow-hidden group">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  </div>
                  
                  {/* تفاصيل المنتج */}
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="text-xs font-medium text-helden-purple-dark bg-helden-purple-light bg-opacity-20 rounded-full px-3 py-1">
                        {product.category}
                      </span>
                      
                      {/* حالة المخزون */}
                      <span className={`text-xs font-medium text-white ${getStockStatusColor(product.stockStatus)} rounded-full px-3 py-1 mr-2`}>
                        {getStockStatusText(product.stockStatus)}
                      </span>
                    </div>
                    
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-helden-purple transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-helden-purple">
                        {product.price.toLocaleString('ar-SA')} ر.س
                      </span>
                      
                      {product.oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.oldPrice.toLocaleString('ar-SA')} ر.س
                        </span>
                      )}
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-1 bg-white border-2 border-helden-purple text-helden-purple font-medium rounded-full px-4 py-2 text-center hover:bg-helden-purple hover:text-white transition-colors duration-300"
                      >
                        {t('product.details') || 'التفاصيل'}
                      </Link>
                      
                      <button
                        disabled={product.stockStatus === 'out-of-stock'}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2 font-medium text-center ${
                          product.stockStatus === 'out-of-stock'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-helden-purple text-white hover:bg-helden-purple-dark'
                        } transition-colors duration-300`}
                      >
                        <FiShoppingBag />
                        <span>{t('product.addToCart') || 'أضف للسلة'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center mb-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-helden-purple-light rounded-full flex items-center justify-center">
              <FiHeart className="text-3xl text-helden-purple" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {t('favorites.empty.title') || 'قائمة المفضلة فارغة'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('favorites.empty.message') || 'لم تقومي بإضافة أي منتجات إلى المفضلة بعد. تصفحي منتجاتنا واضغطي على أيقونة القلب لإضافتها إلى المفضلة.'}
            </p>
            <Link
              href="/products"
              className="inline-block bg-helden-purple text-white font-medium rounded-full px-6 py-3 hover:bg-helden-purple-dark transition-colors"
            >
              {t('favorites.empty.browseProducts') || 'تصفح المنتجات'}
            </Link>
          </motion.div>
        )}

        {/* المنتجات الموصى بها */}
        {favorites.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t('favorites.recommendations') || 'قد يعجبك أيضًا'}
            </h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {recommendedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-helden-purple-dark bg-helden-purple-light bg-opacity-20 rounded-full px-2 py-0.5">
                        {product.category}
                      </span>
                    </div>
                    
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-sm font-bold mb-1 hover:text-helden-purple transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="text-sm font-bold text-helden-purple">
                      {product.price.toLocaleString('ar-SA')} ر.س
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
        
        {/* قسم النشرة البريدية */}
        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </main>
  );
} 