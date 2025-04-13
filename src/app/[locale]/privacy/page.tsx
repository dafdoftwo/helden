"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiUser, FiCreditCard, FiDatabase, FiGlobe, FiMail } from 'react-icons/fi';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('overview');

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

  // Privacy policy sections
  const sections = [
    {
      id: 'overview',
      title: t('privacy.sections.overview.title') || 'Privacy Policy Overview',
      icon: <FiShield className="w-5 h-5" />,
    },
    {
      id: 'information',
      title: t('privacy.sections.information.title') || 'Information We Collect',
      icon: <FiDatabase className="w-5 h-5" />,
    },
    {
      id: 'use',
      title: t('privacy.sections.use.title') || 'How We Use Your Information',
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      id: 'security',
      title: t('privacy.sections.security.title') || 'Data Security',
      icon: <FiLock className="w-5 h-5" />,
    },
    {
      id: 'cookies',
      title: t('privacy.sections.cookies.title') || 'Cookies & Tracking',
      icon: <FiGlobe className="w-5 h-5" />,
    },
    {
      id: 'thirdparty',
      title: t('privacy.sections.thirdparty.title') || 'Third-Party Services',
      icon: <FiCreditCard className="w-5 h-5" />,
    },
    {
      id: 'rights',
      title: t('privacy.sections.rights.title') || 'Your Rights',
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      id: 'contact',
      title: t('privacy.sections.contact.title') || 'Contact Us',
      icon: <FiMail className="w-5 h-5" />,
    },
  ];

  // Render section content
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'overview':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.overview.title') || 'Privacy Policy Overview'}</h3>
            <p>
              {t('privacy.sections.overview.text1') || 
                'At HELDEN, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from our online store.'}
            </p>
            <p>
              {t('privacy.sections.overview.text2') || 
                'By accessing or using our website, you agree to the terms of this Privacy Policy. We may update this policy from time to time, and any changes will be posted on this page with an updated revision date.'}
            </p>
            <p>
              {t('privacy.sections.overview.text3') || 
                'This Privacy Policy applies to all information collected through our website, as well as any related services, sales, marketing, or events.'}
            </p>
            <p className="font-medium">
              {t('privacy.sections.overview.lastUpdated') || 'Last Updated: February 1, 2023'}
            </p>
          </div>
        );
        
      case 'information':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.information.title') || 'Information We Collect'}</h3>
            <p>
              {t('privacy.sections.information.text1') || 
                'We collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products, or otherwise contact us.'}
            </p>
            <h4>{t('privacy.sections.information.subtitle1') || 'Personal Information'}</h4>
            <p>
              {t('privacy.sections.information.text2') || 
                'The personal information we collect may include:'}
            </p>
            <ul>
              <li>{t('privacy.sections.information.bullet1') || 'Name and contact details (email address, phone number, shipping and billing address)'}</li>
              <li>{t('privacy.sections.information.bullet2') || 'Account information (username, password)'}</li>
              <li>{t('privacy.sections.information.bullet3') || 'Payment information (credit card details, bank account information)'}</li>
              <li>{t('privacy.sections.information.bullet4') || 'Purchase history and preferences'}</li>
              <li>{t('privacy.sections.information.bullet5') || 'Communications with us'}</li>
            </ul>
            <h4>{t('privacy.sections.information.subtitle2') || 'Automatically Collected Information'}</h4>
            <p>
              {t('privacy.sections.information.text3') || 
                'When you visit our website, we automatically collect certain information about your device, including:'}
            </p>
            <ul>
              <li>{t('privacy.sections.information.bullet6') || 'IP address'}</li>
              <li>{t('privacy.sections.information.bullet7') || 'Browser type and version'}</li>
              <li>{t('privacy.sections.information.bullet8') || 'Operating system'}</li>
              <li>{t('privacy.sections.information.bullet9') || 'Referring website'}</li>
              <li>{t('privacy.sections.information.bullet10') || 'Time and date of your visit'}</li>
              <li>{t('privacy.sections.information.bullet11') || 'Pages you view'}</li>
            </ul>
          </div>
        );
        
      case 'use':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.use.title') || 'How We Use Your Information'}</h3>
            <p>
              {t('privacy.sections.use.text1') || 
                'We use the information we collect for various business purposes, including:'}
            </p>
            <ul>
              <li>{t('privacy.sections.use.bullet1') || 'Processing and fulfilling orders'}</li>
              <li>{t('privacy.sections.use.bullet2') || 'Managing your account'}</li>
              <li>{t('privacy.sections.use.bullet3') || 'Providing customer support'}</li>
              <li>{t('privacy.sections.use.bullet4') || 'Sending order confirmations and updates'}</li>
              <li>{t('privacy.sections.use.bullet5') || 'Communicating about promotions, new products, and other news'}</li>
              <li>{t('privacy.sections.use.bullet6') || 'Analyzing website usage and trends'}</li>
              <li>{t('privacy.sections.use.bullet7') || 'Improving our website and services'}</li>
              <li>{t('privacy.sections.use.bullet8') || 'Detecting and preventing fraud'}</li>
              <li>{t('privacy.sections.use.bullet9') || 'Complying with legal obligations'}</li>
            </ul>
            <p>
              {t('privacy.sections.use.text2') || 
                'We will only use your personal information for the purposes for which we collected it, unless we reasonably believe that we need to use it for another reason that is compatible with the original purpose.'}
            </p>
          </div>
        );
        
      case 'security':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.security.title') || 'Data Security'}</h3>
            <p>
              {t('privacy.sections.security.text1') || 
                'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.'}
            </p>
            <p>
              {t('privacy.sections.security.text2') || 
                'We use industry-standard encryption technologies when transferring and receiving consumer data exchanged with our site. We have appropriate security measures in place in our physical facilities to protect against the loss, misuse, or alteration of information that we have collected from you at our site.'}
            </p>
            <div className="bg-helden-purple-lighter p-4 rounded-lg">
              <h4 className="text-helden-purple-dark font-bold">{t('privacy.sections.security.subtitle') || 'Our Security Measures:'}</h4>
              <ul>
                <li>{t('privacy.sections.security.bullet1') || 'SSL/TLS encryption for all data transmissions'}</li>
                <li>{t('privacy.sections.security.bullet2') || 'PCI DSS compliance for payment processing'}</li>
                <li>{t('privacy.sections.security.bullet3') || 'Regular security assessments and updates'}</li>
                <li>{t('privacy.sections.security.bullet4') || 'Restricted access to personal information'}</li>
                <li>{t('privacy.sections.security.bullet5') || 'Employee training on privacy and security practices'}</li>
              </ul>
            </div>
          </div>
        );
        
      case 'cookies':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.cookies.title') || 'Cookies & Tracking'}</h3>
            <p>
              {t('privacy.sections.cookies.text1') || 
                'We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.'}
            </p>
            <p>
              {t('privacy.sections.cookies.text2') || 
                'We use the following types of cookies:'}
            </p>
            <ul>
              <li><strong>{t('privacy.sections.cookies.bullet1.title') || 'Essential Cookies:'}</strong> {t('privacy.sections.cookies.bullet1.text') || 'Necessary for the website to function properly'}</li>
              <li><strong>{t('privacy.sections.cookies.bullet2.title') || 'Functional Cookies:'}</strong> {t('privacy.sections.cookies.bullet2.text') || 'Allow us to remember your preferences and customize your experience'}</li>
              <li><strong>{t('privacy.sections.cookies.bullet3.title') || 'Analytical Cookies:'}</strong> {t('privacy.sections.cookies.bullet3.text') || 'Help us understand how visitors interact with our website'}</li>
              <li><strong>{t('privacy.sections.cookies.bullet4.title') || 'Marketing Cookies:'}</strong> {t('privacy.sections.cookies.bullet4.text') || 'Used to track visitors across websites to display relevant advertisements'}</li>
            </ul>
            <p>
              {t('privacy.sections.cookies.text3') || 
                'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.'}
            </p>
          </div>
        );
        
      case 'thirdparty':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.thirdparty.title') || 'Third-Party Services'}</h3>
            <p>
              {t('privacy.sections.thirdparty.text1') || 
                'We may use third-party service providers to help us operate our business and the website or administer activities on our behalf, such as payment processing, shipping, and analyzing our site usage.'}
            </p>
            <p>
              {t('privacy.sections.thirdparty.text2') || 
                'These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.'}
            </p>
            <h4>{t('privacy.sections.thirdparty.subtitle') || 'Our third-party service providers include:'}</h4>
            <ul>
              <li>{t('privacy.sections.thirdparty.bullet1') || 'Payment processors (Stripe, PayPal, Mada, Tabby, Tamara)'}</li>
              <li>{t('privacy.sections.thirdparty.bullet2') || 'Shipping and logistics providers (Aramex, SMSA, Saudi Post, DHL)'}</li>
              <li>{t('privacy.sections.thirdparty.bullet3') || 'Analytics providers (Google Analytics)'}</li>
              <li>{t('privacy.sections.thirdparty.bullet4') || 'Marketing and communication platforms'}</li>
              <li>{t('privacy.sections.thirdparty.bullet5') || 'Customer support services'}</li>
            </ul>
            <p>
              {t('privacy.sections.thirdparty.text3') || 
                'We do not sell, trade, or otherwise transfer your personal information to third parties for marketing purposes without your consent.'}
            </p>
          </div>
        );
        
      case 'rights':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.rights.title') || 'Your Rights'}</h3>
            <p>
              {t('privacy.sections.rights.text1') || 
                'Depending on your location, you may have certain rights regarding your personal information, including:'}
            </p>
            <ul>
              <li><strong>{t('privacy.sections.rights.bullet1.title') || 'Right to Access:'}</strong> {t('privacy.sections.rights.bullet1.text') || 'You have the right to request copies of your personal information.'}</li>
              <li><strong>{t('privacy.sections.rights.bullet2.title') || 'Right to Rectification:'}</strong> {t('privacy.sections.rights.bullet2.text') || 'You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.'}</li>
              <li><strong>{t('privacy.sections.rights.bullet3.title') || 'Right to Erasure:'}</strong> {t('privacy.sections.rights.bullet3.text') || 'You have the right to request that we erase your personal information, under certain conditions.'}</li>
              <li><strong>{t('privacy.sections.rights.bullet4.title') || 'Right to Restrict Processing:'}</strong> {t('privacy.sections.rights.bullet4.text') || 'You have the right to request that we restrict the processing of your personal information, under certain conditions.'}</li>
              <li><strong>{t('privacy.sections.rights.bullet5.title') || 'Right to Object to Processing:'}</strong> {t('privacy.sections.rights.bullet5.text') || 'You have the right to object to our processing of your personal information, under certain conditions.'}</li>
              <li><strong>{t('privacy.sections.rights.bullet6.title') || 'Right to Data Portability:'}</strong> {t('privacy.sections.rights.bullet6.text') || 'You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.'}</li>
            </ul>
            <p>
              {t('privacy.sections.rights.text2') || 
                'If you wish to exercise any of these rights, please contact us using the information provided in the "Contact Us" section.'}
            </p>
          </div>
        );
        
      case 'contact':
        return (
          <div className="prose prose-lg max-w-none">
            <h3>{t('privacy.sections.contact.title') || 'Contact Us'}</h3>
            <p>
              {t('privacy.sections.contact.text1') || 
                'If you have any questions about this Privacy Policy, please contact us at:'}
            </p>
            <div className="bg-helden-purple-lighter p-4 rounded-lg">
              <p className="mb-1"><strong>HELDEN</strong></p>
              <p className="mb-1">Email: privacy@helden.sa</p>
              <p className="mb-1">Phone: +966 12 345 6789</p>
              <p>Address: King Abdullah Road, Riyadh, Saudi Arabia</p>
            </div>
            <p className="mt-6">
              {t('privacy.sections.contact.text2') || 
                'We will respond to your request within 30 days.'}
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-helden-purple-lighter min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/Abayas/Saudi_Abayas_6.jpg"
            alt="Privacy Policy"
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
              {t('privacy.title') || 'Privacy Policy'}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              {t('privacy.subtitle') || "We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Sidebar Navigation */}
            <div className="md:w-1/4">
              <div className="bg-helden-purple-lighter rounded-xl p-4 sticky top-24">
                <h3 className="font-semibold text-lg mb-4 text-helden-purple-dark">
                  {t('privacy.sections.title') || 'Policy Sections'}
                </h3>
                <nav className="space-y-2">
                  {sections.map(section => (
                    <button 
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id 
                          ? 'bg-helden-purple text-white'
                          : 'hover:bg-helden-purple-lighter/60 text-helden-purple-dark'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-6 md:p-8"
              >
                {renderSectionContent(activeSection)}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Consent Banner */}
      <section className="py-16 bg-helden-purple-lighter">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-helden-purple-dark">
              {t('privacy.consent.title') || 'Your Privacy Matters'}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {t('privacy.consent.text') || "By using our website and services, you consent to the practices described in this Privacy Policy. We respect your privacy and are committed to maintaining your trust."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('privacy.consent.contactBtn') || 'Contact Privacy Team'}
              </Link>
              <Link 
                href="/terms" 
                className="bg-transparent border-2 border-helden-purple text-helden-purple px-8 py-3 rounded-full font-medium hover:bg-helden-purple hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('privacy.consent.termsBtn') || 'Terms of Service'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 