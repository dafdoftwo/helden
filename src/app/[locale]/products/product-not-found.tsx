"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag, FiSearch, FiArrowRight } from 'react-icons/fi';

export default function ProductNotFoundPage() {
  const { t, dir } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Elegant Black Abaya",
      image: "/images/Abayas/Saudi_Abayas_1.jpg",
      price: 450,
      category: "abayas",
      link: "/products/elegant-black-abaya",
    },
    {
      id: 2,
      name: "Casual Summer Dress",
      image: "/images/Abayas/Saudi_Abayas_2.jpg",
      price: 320,
      category: "casual",
      link: "/products/casual-summer-dress",
    },
    {
      id: 3,
      name: "Modern Embroidered Abaya",
      image: "/images/Abayas/Saudi_Abayas_3.jpg",
      price: 520,
      category: "abayas",
      link: "/products/modern-embroidered-abaya",
    },
    {
      id: 4,
      name: "Formal Office Attire",
      image: "/images/Abayas/Saudi_Abayas_4.jpg",
      price: 380,
      category: "formal",
      link: "/products/formal-office-attire",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter" dir={dir}>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src="/images/Abayas/Saudi_Abayas_7.jpg"
            alt="Product Not Found"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <Image
                  src="/images/error-404.svg"
                  alt="Product Not Found"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-helden-purple-dark">
                {t('product.notFound') || 'Product Not Found'}
              </h1>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-700 mb-6"
            >
              {t('product.notFoundMessage') || 'The product you are looking for does not exist or has been removed.'}
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/products" 
                className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-5 h-5" />
                {t('common.continueShoping') || 'Continue Shopping'}
              </Link>
              
              <Link 
                href="/" 
                className="bg-transparent border-2 border-helden-purple text-helden-purple px-8 py-3 rounded-full font-medium hover:bg-helden-purple hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                {t('common.backToHome') || 'Back to Home'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold text-helden-purple-dark mb-4">
              {t('error.lookingFor') || 'Looking for something specific?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('error.trySearch') || 'Try searching for what you need or explore our popular products.'}
            </p>
            
            <div className="relative max-w-lg mx-auto mb-10">
              <form action="/search" method="get" className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder={t('common.searchPlaceholder') || "Search for products..."}
                  className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-helden-purple focus:border-transparent shadow-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-helden-purple hover:text-helden-purple-dark"
                >
                  <FiSearch className="text-xl" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-r from-helden-purple-lighter to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl font-bold text-helden-purple-dark mb-2">
              {t('product.youMightLike') || 'You Might Like These Products'}
            </h3>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <Link href={product.link} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-helden-purple uppercase font-medium mb-1">{t(`categories.${product.category}`) || product.category}</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 transition-colors group-hover:text-helden-purple">{product.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-helden-purple font-bold">{product.price} {t('common.sar') || 'SAR'}</span>
                      <span className="text-sm text-gray-500 group-hover:text-helden-purple flex items-center transition-colors">
                        {t('common.viewProduct') || 'View'} <FiArrowRight className="ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-8 py-3 bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {t('product.viewAllProducts') || 'View All Products'} <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl font-bold text-helden-purple-dark mb-2">
              {t('common.exploreCategories') || 'Explore Categories'}
            </h3>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {['abayas', 'casual', 'formal', 'sport', 'bodyshapers'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Link href={`/products/category/${category}`} className="block">
                  <div className="relative h-32 rounded-xl overflow-hidden">
                    <Image
                      src={`/images/categories/${category}.jpg`}
                      alt={t(`categories.${category}`) || category}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-helden-purple-dark/70 to-transparent flex items-end justify-center p-4">
                      <h4 className="text-white font-medium text-center">
                        {t(`categories.${category}`) || category}
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 