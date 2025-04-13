"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiTruck, FiClock, FiGlobe, FiMapPin, FiPackage, FiShield, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function ShippingPage() {
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

  // Shipping partners
  const shippingPartners = [
    {
      name: "Aramex",
      logo: "/images/payment/mada.svg", // Placeholder, replace with actual logo
      description: t('shipping.partners.aramex') || "Our premium shipping partner for fast local and international deliveries."
    },
    {
      name: "SMSA",
      logo: "/images/payment/visa.svg", // Placeholder, replace with actual logo
      description: t('shipping.partners.smsa') || "Reliable domestic shipping with extensive coverage across Saudi Arabia."
    },
    {
      name: "Saudi Post",
      logo: "/images/payment/mastercard.svg", // Placeholder, replace with actual logo
      description: t('shipping.partners.saudiPost') || "Economical shipping option for non-urgent deliveries."
    },
    {
      name: "DHL",
      logo: "/images/payment/apple-pay.svg", // Placeholder, replace with actual logo
      description: t('shipping.partners.dhl') || "Premium international shipping with express delivery options."
    }
  ];

  // Delivery times
  const deliveryTimes = [
    {
      icon: <FiMapPin className="text-helden-purple w-6 h-6" />,
      region: t('shipping.regions.major') || "Major Cities",
      time: t('shipping.times.major') || "1-3 business days"
    },
    {
      icon: <FiMapPin className="text-helden-purple w-6 h-6" />,
      region: t('shipping.regions.towns') || "Other Cities & Towns",
      time: t('shipping.times.towns') || "3-5 business days"
    },
    {
      icon: <FiMapPin className="text-helden-purple w-6 h-6" />,
      region: t('shipping.regions.remote') || "Remote Areas",
      time: t('shipping.times.remote') || "5-7 business days"
    },
    {
      icon: <FiGlobe className="text-helden-purple w-6 h-6" />,
      region: t('shipping.regions.gcc') || "GCC Countries",
      time: t('shipping.times.gcc') || "3-7 business days"
    },
    {
      icon: <FiGlobe className="text-helden-purple w-6 h-6" />,
      region: t('shipping.regions.international') || "International",
      time: t('shipping.times.international') || "7-14 business days"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-helden-purple-lighter min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/Abayas/Saudi_Abayas_4.jpg"
            alt="Shipping & Delivery"
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
              {t('shipping.title') || 'Shipping & Delivery'}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              {t('shipping.subtitle') || "Fast, reliable shipping to your doorstep. We partner with trusted carriers to ensure your order arrives safely and on time."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Highlights */}
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
                <FiTruck className="text-helden-purple text-3xl mr-3" />
                <h3 className="text-xl font-semibold text-helden-purple-dark">
                  {t('shipping.highlights.title1') || 'Free Shipping'}
                </h3>
              </div>
              <p className="text-gray-700">
                {t('shipping.highlights.description1') || 'Free shipping on all orders over 300 SAR within Saudi Arabia.'}
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
                <FiClock className="text-helden-purple text-3xl mr-3" />
                <h3 className="text-xl font-semibold text-helden-purple-dark">
                  {t('shipping.highlights.title2') || 'Fast Delivery'}
                </h3>
              </div>
              <p className="text-gray-700">
                {t('shipping.highlights.description2') || 'Quick delivery within 1-3 business days to major cities across Saudi Arabia.'}
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
                <FiPackage className="text-helden-purple text-3xl mr-3" />
                <h3 className="text-xl font-semibold text-helden-purple-dark">
                  {t('shipping.highlights.title3') || 'Order Tracking'}
                </h3>
              </div>
              <p className="text-gray-700">
                {t('shipping.highlights.description3') || 'Track your order in real-time with our easy-to-use tracking system.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delivery Times */}
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
              {t('shipping.deliveryTimes.title') || 'Estimated Delivery Times'}
            </h2>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-xl mx-auto">
              {t('shipping.deliveryTimes.subtitle') || 'Delivery times vary based on your location. Here are the estimated delivery times for different regions.'}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliveryTimes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md flex items-center"
              >
                <div className="bg-helden-purple-lighter w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-helden-purple-dark mb-1">
                    {item.region}
                  </h3>
                  <p className="text-gray-600">
                    {item.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Partners */}
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
              {t('shipping.partners.title') || 'Our Shipping Partners'}
            </h2>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-xl mx-auto">
              {t('shipping.partners.subtitle') || 'We partner with trusted shipping carriers to ensure your order arrives safely and on time.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {shippingPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-helden-purple-dark mb-3">
                  {partner.name}
                </h3>
                <p className="text-gray-600">
                  {partner.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Policy Details */}
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
              {t('shipping.policy.title') || 'Shipping Policy Details'}
            </h2>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <h3>{t('shipping.policy.processing') || 'Order Processing'}</h3>
              <p>
                {t('shipping.policy.processingText') || 'Orders are typically processed within 24-48 hours after payment confirmation. During peak seasons or promotional periods, processing time may be extended.'}
              </p>
              
              <h3>{t('shipping.policy.methods') || 'Shipping Methods'}</h3>
              <p>
                {t('shipping.policy.methodsText') || 'We offer standard and express shipping options. The availability of these options may vary based on your location and the items in your order.'}
              </p>
              
              <h3>{t('shipping.policy.costs') || 'Shipping Costs'}</h3>
              <p>
                {t('shipping.policy.costsText') || 'Shipping costs are calculated based on your location, the weight of your order, and your selected shipping method. Orders over 300 SAR qualify for free standard shipping within Saudi Arabia.'}
              </p>
              
              <h3>{t('shipping.policy.tracking') || 'Order Tracking'}</h3>
              <p>
                {t('shipping.policy.trackingText') || 'Once your order ships, you will receive a confirmation email with a tracking number and link. You can also track your order through your account dashboard.'}
              </p>
              
              <h3>{t('shipping.policy.international') || 'International Shipping'}</h3>
              <p>
                {t('shipping.policy.internationalText') || 'For international orders, please note that customs duties and taxes may apply. These charges are the responsibility of the recipient and are not included in our shipping fees.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-helden-gold-light border-l-4 border-helden-gold p-6 rounded-lg flex">
              <FiAlertCircle className="text-helden-purple-dark text-2xl mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-helden-purple-dark mb-2">
                  {t('shipping.notes.title') || 'Important Notes'}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FiShield className="text-helden-purple mr-2 mt-1 flex-shrink-0" />
                    <span>{t('shipping.notes.note1') || 'Delivery times are estimates and may vary due to unforeseen circumstances.'}</span>
                  </li>
                  <li className="flex items-start">
                    <FiShield className="text-helden-purple mr-2 mt-1 flex-shrink-0" />
                    <span>{t('shipping.notes.note2') || 'Please ensure your shipping address is correct before placing your order.'}</span>
                  </li>
                  <li className="flex items-start">
                    <FiShield className="text-helden-purple mr-2 mt-1 flex-shrink-0" />
                    <span>{t('shipping.notes.note3') || 'For any delivery issues, please contact our customer service team within 48 hours of the expected delivery date.'}</span>
                  </li>
                  <li className="flex items-start">
                    <FiShield className="text-helden-purple mr-2 mt-1 flex-shrink-0" />
                    <span>{t('shipping.notes.note4') || 'During holidays and promotional periods, delivery times may be longer than usual.'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Track Order CTA */}
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
              {t('shipping.track.title') || 'Track Your Order'}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t('shipping.track.text') || 'Want to know where your order is? Track it now to get real-time updates on your delivery.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tracking" 
                className="bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {t('shipping.track.button') || 'Track Your Order'}
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-helden-purple transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('shipping.contact.button') || 'Contact Support'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 