"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiSearch, FiShoppingBag, FiTruck, FiCreditCard, FiRefreshCw, FiUser } from 'react-icons/fi';
import Link from 'next/link';

export default function FAQPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

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

  // FAQ Categories with icons
  const categories = [
    { id: 'all', name: t('faq.categories.all') || 'All FAQs', icon: <FiUser className="w-5 h-5" /> },
    { id: 'orders', name: t('faq.categories.orders') || 'Orders', icon: <FiShoppingBag className="w-5 h-5" /> },
    { id: 'shipping', name: t('faq.categories.shipping') || 'Shipping & Delivery', icon: <FiTruck className="w-5 h-5" /> },
    { id: 'payment', name: t('faq.categories.payment') || 'Payment', icon: <FiCreditCard className="w-5 h-5" /> },
    { id: 'returns', name: t('faq.categories.returns') || 'Returns & Refunds', icon: <FiRefreshCw className="w-5 h-5" /> },
  ];

  // FAQ items with category tags
  const faqItems = [
    {
      question: t('faq.questions.q1') || 'How do I track my order?',
      answer: t('faq.answers.a1') || 'You can track your order by logging into your account and visiting the "Order History" section. Alternatively, you can use the tracking number provided in your shipping confirmation email to track your package directly on our carrier\'s website.',
      category: 'orders'
    },
    {
      question: t('faq.questions.q2') || 'What payment methods do you accept?',
      answer: t('faq.answers.a2') || 'We accept various payment methods including credit/debit cards (Visa, Mastercard, Mada), Apple Pay, Tabby, Tamara, and cash on delivery (COD) for orders within Saudi Arabia.',
      category: 'payment'
    },
    {
      question: t('faq.questions.q3') || 'How long will it take to receive my order?',
      answer: t('faq.answers.a3') || 'Delivery times vary depending on your location. Orders are typically delivered within 1-3 business days in major cities, 3-5 business days in other cities and towns, and 5-7 business days in remote areas. International shipping may take 7-14 business days.',
      category: 'shipping'
    },
    {
      question: t('faq.questions.q4') || 'Can I change or cancel my order after it\'s placed?',
      answer: t('faq.answers.a4') || 'You can change or cancel your order within 1 hour of placing it by contacting our customer service team. Once the order has been processed or shipped, it cannot be changed or canceled, but you can return it according to our return policy.',
      category: 'orders'
    },
    {
      question: t('faq.questions.q5') || 'What is your return policy?',
      answer: t('faq.answers.a5') || 'You can return items within 14 days of delivery. The items must be unworn, unwashed, and in their original packaging with all tags attached. For more details, please visit our Returns page.',
      category: 'returns'
    },
    {
      question: t('faq.questions.q6') || 'How do I return an item?',
      answer: t('faq.answers.a6') || 'To return an item, contact our customer service team within 14 days of receiving your order. They will guide you through the return process and provide you with a return shipping label if applicable.',
      category: 'returns'
    },
    {
      question: t('faq.questions.q7') || 'Is free shipping available?',
      answer: t('faq.answers.a7') || 'Yes, we offer free standard shipping on all orders over 300 SAR within Saudi Arabia. For orders below this amount, standard shipping fees will apply.',
      category: 'shipping'
    },
    {
      question: t('faq.questions.q8') || 'How can I check the status of my refund?',
      answer: t('faq.answers.a8') || 'Once your return is processed, you will receive an email notification. Refunds typically take 5-7 business days to appear in your account, depending on your bank or payment provider. You can also check the status in your account dashboard.',
      category: 'returns'
    },
    {
      question: t('faq.questions.q9') || 'Are there any items that cannot be returned?',
      answer: t('faq.answers.a9') || 'Yes, sale items, intimate wear, and customized products cannot be returned unless they are defective or damaged upon receipt.',
      category: 'returns'
    },
    {
      question: t('faq.questions.q10') || 'Do you ship internationally?',
      answer: t('faq.answers.a10') || 'Yes, we ship to many countries worldwide. International shipping costs and delivery times vary based on the destination. Please note that customs duties and taxes may apply and are the responsibility of the recipient.',
      category: 'shipping'
    },
    {
      question: t('faq.questions.q11') || 'Is my payment information secure?',
      answer: t('faq.answers.a11') || 'Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your full credit card details on our servers.',
      category: 'payment'
    },
    {
      question: t('faq.questions.q12') || 'Can I pay with multiple payment methods?',
      answer: t('faq.answers.a12') || 'Currently, we only support one payment method per order. However, you can use Buy Now Pay Later options like Tabby or Tamara to split your payment into installments.',
      category: 'payment'
    },
  ];

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle FAQ item
  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-helden-purple-lighter min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/Abayas/Saudi_Abayas_7.jpg"
            alt="Frequently Asked Questions"
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
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 text-helden-purple-dark"
            >
              {t('faq.title') || 'Frequently Asked Questions'}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              {t('faq.subtitle') || "Find answers to the most common questions about our products, shipping, payments, and more."}
            </motion.p>
            
            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="relative max-w-xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('faq.searchPlaceholder') || "Search FAQs..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-helden-purple focus:border-transparent shadow-sm"
                />
                <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-helden-purple text-xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-helden-purple text-white shadow-md'
                    : 'bg-helden-purple-lighter text-helden-purple-dark hover:bg-helden-purple-light'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-helden-purple-lighter/30 transition-colors focus:outline-none"
                    >
                      <span className="text-xl font-medium text-helden-purple-dark pr-4">{faq.question}</span>
                      {openItems.includes(index) ? (
                        <FiChevronUp className="text-helden-purple flex-shrink-0 text-2xl" />
                      ) : (
                        <FiChevronDown className="text-helden-purple flex-shrink-0 text-2xl" />
                      )}
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        openItems.includes(index) 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      <div className="px-6 py-4 border-t border-gray-100">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiSearch className="mx-auto text-4xl text-helden-purple mb-4" />
                <h3 className="text-xl font-medium text-helden-purple-dark mb-2">
                  {t('faq.noResults') || 'No results found'}
                </h3>
                <p className="text-gray-500">
                  {t('faq.tryAgain') || 'Try different keywords or browse all categories'}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 text-helden-purple hover:text-helden-purple-dark hover:underline"
                >
                  {t('faq.viewAll') || 'View all FAQs'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-r from-helden-purple to-helden-purple-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              {t('faq.stillHaveQuestions.title') || 'Still Have Questions?'}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t('faq.stillHaveQuestions.text') || "If you couldn't find an answer to your question, our customer support team is here to help."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {t('faq.stillHaveQuestions.contactBtn') || 'Contact Us'}
              </Link>
              <Link 
                href="/shipping" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-helden-purple transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('faq.stillHaveQuestions.shippingBtn') || 'Shipping Info'}
              </Link>
              <Link 
                href="/returns" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-helden-purple transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('faq.stillHaveQuestions.returnsBtn') || 'Returns Policy'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 