"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiFileText, FiShoppingBag, FiTruck, FiCreditCard, FiShield, FiGlobe, FiAlertCircle, FiUser, FiRefreshCw, FiInfo, FiAlertOctagon, FiEdit, FiMail } from 'react-icons/fi';
import Link from 'next/link';

export default function TermsPage() {
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

  return (
    <div className="bg-gradient-to-b from-white to-helden-purple-lighter min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="/images/Dresses/Dress_7.jpg"
            alt="Terms of Service"
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
              {t('terms.title') || 'Terms of Service'}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              {t('terms.subtitle') || "Please read these terms carefully before using our website and services. These terms establish the rules for using our platform and purchasing our products."}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mb-6 text-gray-500 flex justify-center items-center gap-1"
            >
              <span>{t('terms.lastUpdated') || 'Last updated:'}</span>
              <span className="font-medium">February 1, 2023</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md p-6 md:p-10"
          >
            {/* Introduction */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiFileText className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.introduction.title') || 'Introduction'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.introduction.text1') || 
                  'Welcome to HELDEN, an online store specializing in women\'s clothing in Saudi Arabia. These Terms of Service ("Terms") govern your access to and use of the HELDEN website and services, including any content, functionality, and services offered on or through www.helden.sa (the "Website").'}
                </p>
                <p>
                  {t('terms.introduction.text2') || 
                  'By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you may not access the Website or use any services.'}
                </p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiUser className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.eligibility.title') || 'Eligibility'}
                  </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.eligibility.text1') || 
                  'The Website is intended for users who are at least 18 years old. By using this Website, you represent and warrant that you are of legal age to form a binding contract with the Company and meet all of the foregoing eligibility requirements.'}
                </p>
              </div>
                  </div>

            {/* Products */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiShoppingBag className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.products.title') || 'Products and Services'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.products.text1') || 
                  'All products displayed on the Website are subject to availability. We reserve the right to discontinue any product at any time.'}
                </p>
                <p>
                  {t('terms.products.text2') || 
                  'We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the service will be corrected.'}
                </p>
                <h3>
                  {t('terms.products.pricing') || 'Pricing and Availability'}
                </h3>
                <p>
                  {t('terms.products.text3') || 
                  'Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.'}
                </p>
                <p>
                  {t('terms.products.text4') || 
                  'We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.'}
                </p>
              </div>
            </div>

            {/* Orders */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiShoppingBag className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.orders.title') || 'Orders and Purchases'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.orders.text1') || 
                  'When you place an order through the Website, we will send you an email acknowledging receipt of your order. This email is only an acknowledgment and does not constitute acceptance of your order.'}
                </p>
                <p>
                  {t('terms.orders.text2') || 
                  'We reserve the right to refuse or cancel your order at any time for reasons including but not limited to product availability, errors in the description or price of the product, error in your order, or other reasons.'}
                </p>
                <p>
                  {t('terms.orders.text3') || 
                  'If we cancel your order after you have already been charged, we will issue a refund to you in the amount of the charge.'}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiCreditCard className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.payment.title') || 'Payment'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.payment.text1') || 
                  'We accept various payment methods, including credit cards, debit cards, and digital payment platforms like Mada, Tabby, and Tamara. All payments are processed securely through our trusted payment processors.'}
                </p>
                <p>
                  {t('terms.payment.text2') || 
                  'By providing a payment method, you represent and warrant that you are authorized to use the designated payment method and that you authorize us to charge your payment method for the total amount of your order (including any taxes and shipping charges).'}
                </p>
                <p>
                  {t('terms.payment.text3') || 
                  'If the payment method you provide cannot be verified, is invalid, or is otherwise not acceptable, your order may be suspended or cancelled.'}
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiTruck className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.shipping.title') || 'Shipping and Delivery'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.shipping.text1') || 
                  'We will make every effort to deliver your order according to the estimated delivery times provided at checkout. However, delivery dates are approximate and not guaranteed.'}
                </p>
                <p>
                  {t('terms.shipping.text2') || 
                  'We are not responsible for any delays, damages, or losses that occur during shipping once the product has been handed over to the shipping carrier.'}
                </p>
                <p>
                  {t('terms.shipping.text3') || 
                  'For more information on shipping methods, delivery times, and shipping fees, please visit our Shipping Policy page.'}
                </p>
                <div className="mt-4">
                  <Link
                    href="/shipping"
                    className="text-helden-purple hover:text-helden-purple-dark underline"
                  >
                    {t('terms.shipping.link') || 'View Shipping Policy →'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Returns */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiRefreshCw className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.returns.title') || 'Returns and Refunds'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.returns.text1') || 
                  'We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible items within 14 days of delivery for a full refund or exchange.'}
                </p>
                <p>
                  {t('terms.returns.text2') || 
                  'Certain items are non-returnable for hygiene reasons or due to their nature. Please check our Returns Policy for detailed information on eligibility, process, and exceptions.'}
                </p>
                <div className="mt-4">
                  <Link
                    href="/returns"
                    className="text-helden-purple hover:text-helden-purple-dark underline"
                  >
                    {t('terms.returns.link') || 'View Returns Policy →'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiShield className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.intellectualProperty.title') || 'Intellectual Property'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.intellectualProperty.text1') || 
                  'The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by HELDEN, its licensors, or other providers of such material and are protected by Saudi Arabian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.'}
                </p>
                <p>
                  {t('terms.intellectualProperty.text2') || 
                  'These Terms permit you to use the Website for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Website, except as follows:'}
                </p>
                <ul>
                  <li>{t('terms.intellectualProperty.bullet1') || 'Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.'}</li>
                  <li>{t('terms.intellectualProperty.bullet2') || 'You may store files that are automatically cached by your web browser for display enhancement purposes.'}</li>
                  <li>{t('terms.intellectualProperty.bullet3') || 'You may print or download one copy of a reasonable number of pages of the Website for your own personal, non-commercial use and not for further reproduction, publication, or distribution.'}</li>
                </ul>
              </div>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiUser className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.userAccounts.title') || 'User Accounts'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.userAccounts.text1') || 
                  'When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Website.'}
                </p>
                <p>
                  {t('terms.userAccounts.text2') || 
                  'You are responsible for safeguarding the password that you use to access the Website and for any activities or actions under your password, whether your password is with our Website or a third-party service.'}
                </p>
                <p>
                  {t('terms.userAccounts.text3') || 
                  'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.'}
                </p>
              </div>
            </div>

            {/* Prohibited Uses */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiAlertCircle className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.prohibitedUses.title') || 'Prohibited Uses'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.prohibitedUses.text1') || 
                  'You may use the Website only for lawful purposes and in accordance with these Terms. You agree not to use the Website:'}
                </p>
                <ul>
                  <li>{t('terms.prohibitedUses.bullet1') || 'In any way that violates any applicable local, national, or international law or regulation.'}</li>
                  <li>{t('terms.prohibitedUses.bullet2') || 'For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.'}</li>
                  <li>{t('terms.prohibitedUses.bullet3') || 'To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.'}</li>
                  <li>{t('terms.prohibitedUses.bullet4') || 'To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.'}</li>
                  <li>{t('terms.prohibitedUses.bullet5') || 'To engage in any other conduct that restricts or inhibits anyone\'s use or enjoyment of the Website, or which may harm the Company or users of the Website or expose them to liability.'}</li>
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiInfo className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.disclaimer.title') || 'Disclaimer of Warranties'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.disclaimer.text1') || 
                  'The Website and all content, materials, information, products, and services provided on the Website, are provided on an "as is" and "as available" basis. HELDEN makes no representations or warranties of any kind, express or implied, as to the operation of the Website or the information, content, materials, products, or services included on or otherwise made available to you through the Website.'}
                </p>
                <p>
                  {t('terms.disclaimer.text2') || 
                  'To the full extent permissible by applicable law, HELDEN disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose. HELDEN does not warrant that the Website, its servers, or e-mail sent from HELDEN are free of viruses or other harmful components.'}
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiAlertOctagon className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.liability.title') || 'Limitation of Liability'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.liability.text1') || 
                  'In no event shall HELDEN, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any (i) errors, mistakes, or inaccuracies of content; (ii) personal injury or property damage; (iii) unauthorized access to or use of our servers and/or any personal information stored therein; (iv) interruption or cessation of transmission to or from our Website; (v) bugs, viruses, trojan horses, or the like, which may be transmitted to or through our Website by any third party; and/or (vi) errors or omissions in any content or for any loss or damage of any kind incurred as a result of your use of any content posted, emailed, transmitted, or otherwise made available via the Website, whether based on warranty, contract, tort, or any other legal theory, and whether or not the company is advised of the possibility of such damages.'}
                </p>
                <p>
                  {t('terms.liability.text2') || 
                  'The foregoing limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction.'}
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiGlobe className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.governingLaw.title') || 'Governing Law'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.governingLaw.text1') || 
                  'These Terms shall be governed and construed in accordance with the laws of the Kingdom of Saudi Arabia, without regard to its conflict of law provisions.'}
                </p>
                <p>
                  {t('terms.governingLaw.text2') || 
                  'Any dispute arising out of or relating to these Terms, or any breach thereof, shall be finally resolved by the competent courts in the Kingdom of Saudi Arabia.'}
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiEdit className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.changes.title') || 'Changes to Terms'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.changes.text1') || 
                  'We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms by posting updates and changes to our Website. It is your responsibility to check our Website periodically for changes.'}
                </p>
                <p>
                  {t('terms.changes.text2') || 
                  'Your continued use of or access to our Website following the posting of any changes to these Terms constitutes acceptance of those changes.'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                <FiMail className="text-helden-purple mr-3 w-6 h-6" />
                <h2 className="text-2xl font-bold text-helden-purple-dark">
                  {t('terms.contact.title') || 'Contact Information'}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  {t('terms.contact.text1') || 
                  'Questions about the Terms of Service should be sent to us at info@helden.sa or by mail to:'}
                </p>
                <div className="bg-helden-purple-lighter p-4 rounded-lg mt-4">
                  <p className="mb-1"><strong>HELDEN</strong></p>
                  <p className="mb-1">King Abdullah Road</p>
                  <p className="mb-1">Riyadh, Saudi Arabia</p>
                  <p>Phone: +966 12 345 6789</p>
                </div>
              </div>
            </div>
              </motion.div>
        </div>
      </section>

      {/* Quick Links */}
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
              {t('terms.quickLinks.title') || 'Related Policies'}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {t('terms.quickLinks.text') || "For a complete understanding of our policies, please also review the following documents:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Link href="/privacy" className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FiShield className="text-helden-purple mb-3 w-8 h-8" />
                <h3 className="font-semibold text-helden-purple-dark mb-1">{t('terms.quickLinks.privacy') || 'Privacy Policy'}</h3>
                <p className="text-sm text-gray-600">{t('terms.quickLinks.privacyDesc') || 'How we handle your data'}</p>
              </Link>
              <Link href="/returns" className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FiRefreshCw className="text-helden-purple mb-3 w-8 h-8" />
                <h3 className="font-semibold text-helden-purple-dark mb-1">{t('terms.quickLinks.returns') || 'Returns Policy'}</h3>
                <p className="text-sm text-gray-600">{t('terms.quickLinks.returnsDesc') || 'Our return and refund process'}</p>
              </Link>
              <Link href="/shipping" className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FiTruck className="text-helden-purple mb-3 w-8 h-8" />
                <h3 className="font-semibold text-helden-purple-dark mb-1">{t('terms.quickLinks.shipping') || 'Shipping Policy'}</h3>
                <p className="text-sm text-gray-600">{t('terms.quickLinks.shippingDesc') || 'Delivery times and methods'}</p>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 