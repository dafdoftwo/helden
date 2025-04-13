"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiHelpCircle, FiPackage, FiCreditCard, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

export default function ReturnsPage() {
  const { t } = useTranslation();

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

  // Return policy steps
  const returnSteps = [
    {
      icon: <FiPackage className="text-helden-purple w-6 h-6" />,
      title: t('returns.step1.title') || 'Contact Customer Service',
      description: t('returns.step1.description') || 'Contact our customer service team within 14 days of receiving your order to request a return.',
    },
    {
      icon: <FiRefreshCw className="text-helden-purple w-6 h-6" />,
      title: t('returns.step2.title') || 'Pack Your Items',
      description: t('returns.step2.description') || 'Repack the items in their original packaging with all tags and labels attached.',
    },
    {
      icon: <FiCreditCard className="text-helden-purple w-6 h-6" />,
      title: t('returns.step3.title') || 'Ship Your Return',
      description: t('returns.step3.description') || 'Use the prepaid shipping label provided by our customer service team to return your items.',
    },
    {
      icon: <FiCalendar className="text-helden-purple w-6 h-6" />,
      title: t('returns.step4.title') || 'Receive Your Refund',
      description: t('returns.step4.description') || 'Once we receive and inspect your return, a refund will be processed to your original payment method within 5-7 business days.',
    },
  ];

  // Return policy FAQs
  const returnFaqs = [
    {
      question: t('returns.faqs.q1') || 'What is the return period?',
      answer: t('returns.faqs.a1') || 'You have 14 days from the delivery date to initiate a return. Items must be in their original condition with tags attached.',
    },
    {
      question: t('returns.faqs.q2') || 'How will I be refunded?',
      answer: t('returns.faqs.a2') || 'Refunds will be processed to your original payment method. It may take 5-7 business days for the refund to appear in your account.',
    },
    {
      question: t('returns.faqs.q3') || 'What items cannot be returned?',
      answer: t('returns.faqs.a3') || 'Sale items, intimate wear, and customized products cannot be returned unless defective or damaged upon receipt.',
    },
    {
      question: t('returns.faqs.q4') || 'Do I have to pay for return shipping?',
      answer: t('returns.faqs.a4') || 'For standard returns, customers are responsible for return shipping costs. For defective or incorrect items, HELDEN will cover the shipping costs.',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-helden-purple-lighter min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/Abayas/Saudi_Abayas_3.jpg"
            alt="Returns & Exchanges"
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
              {t('returns.title') || 'Returns & Exchanges Policy'}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              {t('returns.subtitle') || "We want you to love your purchase. If you're not completely satisfied, we've made our returns and exchanges process simple and convenient."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Return Policy Highlights */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-helden-purple-lighter to-white p-6 rounded-2xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <FiCheckCircle className="text-helden-purple text-3xl mr-3" />
                <h3 className="text-xl font-semibold text-helden-purple-dark">
                  {t('returns.highlights.title1') || '14-Day Returns'}
                </h3>
              </div>
              <p className="text-gray-700">
                {t('returns.highlights.description1') || 'Return any item within 14 days of delivery for a full refund or exchange.'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-helden-purple-lighter to-white p-6 rounded-2xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <FiHelpCircle className="text-helden-purple text-3xl mr-3" />
                <h3 className="text-xl font-semibold text-helden-purple-dark">
                  {t('returns.highlights.title2') || 'Easy Process'}
                </h3>
              </div>
              <p className="text-gray-700">
                {t('returns.highlights.description2') || 'Simple 4-step return process with dedicated customer support to assist you.'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-helden-purple-lighter to-white p-6 rounded-2xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <FiAlertCircle className="text-helden-purple text-3xl mr-3" />
                <h3 className="text-xl font-semibold text-helden-purple-dark">
                  {t('returns.highlights.title3') || 'Quality Guarantee'}
                </h3>
              </div>
              <p className="text-gray-700">
                {t('returns.highlights.description3') || 'Defective or damaged items can be returned for a full refund or replacement at no additional cost.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Return Process Steps */}
      <section className="py-16 bg-gradient-to-r from-helden-purple-lighter to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-helden-purple-dark mb-4">
              {t('returns.process.title') || 'Return Process'}
            </h2>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-xl mx-auto">
              {t('returns.process.subtitle') || 'Follow these simple steps to return your items and receive your refund quickly.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="bg-helden-purple-lighter w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-helden-purple-dark text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Policy Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-helden-purple-dark mb-4">
              {t('returns.policy.title') || 'Return Policy Details'}
            </h2>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <h3>{t('returns.policy.eligibility') || 'Eligibility for Returns'}</h3>
              <p>
                {t('returns.policy.eligibilityText') || 'To be eligible for a return, your item must be unworn, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.'}
              </p>
              
              <h3>{t('returns.policy.timeframe') || 'Return Timeframe'}</h3>
              <p>
                {t('returns.policy.timeframeText') || 'You have 14 days from the delivery date to initiate a return. After 14 days, we cannot guarantee a refund or exchange.'}
              </p>
              
              <h3>{t('returns.policy.exceptions') || 'Return Exceptions'}</h3>
              <p>
                {t('returns.policy.exceptionsText') || 'The following items cannot be returned:'}
              </p>
              <ul>
                <li>{t('returns.policy.exception1') || 'Items marked as "Final Sale" or "Non-Returnable"'}</li>
                <li>{t('returns.policy.exception2') || 'Intimate apparel for hygiene reasons'}</li>
                <li>{t('returns.policy.exception3') || 'Customized or personalized products'}</li>
                <li>{t('returns.policy.exception4') || 'Items damaged due to customer misuse'}</li>
              </ul>
              
              <h3>{t('returns.policy.shipping') || 'Return Shipping'}</h3>
              <p>
                {t('returns.policy.shippingText') || 'For standard returns, customers are responsible for return shipping costs. For defective or incorrectly shipped items, HELDEN will cover the shipping costs and provide a prepaid shipping label.'}
              </p>
              
              <h3>{t('returns.policy.refunds') || 'Refunds'}</h3>
              <p>
                {t('returns.policy.refundsText') || 'Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Return Policy FAQs */}
      <section className="py-16 bg-helden-purple-lighter">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-helden-purple-dark mb-4">
              {t('returns.faqs.title') || 'Frequently Asked Questions'}
            </h2>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {returnFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <h3 className="text-xl font-semibold text-helden-purple-dark mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-helden-purple-dark mb-6">
              {t('returns.contact.title') || 'Need Help With Your Return?'}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {t('returns.contact.text') || 'Our customer service team is here to help you with any questions about returns or exchanges.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {t('returns.contact.contactBtn') || 'Contact Us'}
              </Link>
              <Link 
                href="/faq" 
                className="bg-transparent border-2 border-helden-purple text-helden-purple px-8 py-3 rounded-full font-medium hover:bg-helden-purple hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('returns.contact.faqBtn') || 'Visit FAQ'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 