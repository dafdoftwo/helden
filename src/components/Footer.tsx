"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { FaInstagram, FaTwitter, FaTiktok, FaSnapchatGhost } from 'react-icons/fa';

export default function Footer() {
  const { t, language } = useTranslation();
  
  // Function to get path with locale
  const getLocalizedHref = (path: string): string => {
    if (path === '/') return language === 'en' ? '/' : `/${language}`;
    return language === 'en' ? `/${path}` : `/${language}/${path}`;
  };

  return (
    <footer className="bg-gradient-to-r from-helden-purple-light to-helden-purple-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{t('common.brandName')}</h3>
            <p className="mb-4 text-gray-200">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://instagram.com/helden" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-helden-gold transition-colors" 
                aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com/helden" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-helden-gold transition-colors" 
                aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="https://tiktok.com/@helden" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-helden-gold transition-colors" 
                aria-label="TikTok">
                <FaTiktok size={24} />
              </a>
              <a href="https://snapchat.com/add/helden" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-helden-gold transition-colors" 
                aria-label="Snapchat">
                <FaSnapchatGhost size={24} />
              </a>
            </div>
          </div>
          
          {/* Categories Column */}
          <div>
            <h3 className="font-semibold mb-6 text-lg border-b border-helden-gold-DEFAULT pb-2">
              {t('footer.categories')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalizedHref('products/category/abayas')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('categories.abayas')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/casual')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('categories.casual')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/formal')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('categories.formal')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/sports')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('categories.sports')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/body-shapers')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('categories.bodyShaper')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service Column */}
          <div>
            <h3 className="font-semibold mb-6 text-lg border-b border-helden-gold-DEFAULT pb-2">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalizedHref('tracking')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.trackOrder')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('returns')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('shipping')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('faq')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('contact')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold mb-6 text-lg border-b border-helden-gold-DEFAULT pb-2">
              {t('footer.newsletter')}
            </h3>
            <p className="mb-4 text-gray-200">
              {t('footer.newsletterText')}
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-helden-gold"
              />
              <button type="submit" className="bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark font-medium py-2 px-4 rounded-md transition-colors">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
          
          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold mb-6 text-lg border-b border-helden-gold-DEFAULT pb-2">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalizedHref('')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('about')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('terms')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.termsConditions')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('privacy')} className="text-gray-200 hover:text-white hover:underline transition">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Payment Methods Section */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-medium mb-2">{t('footer.paymentMethods')}</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/visa.svg" alt="Visa" width={30} height={20} />
                </div>
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={30} height={20} />
                </div>
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/apple-pay.svg" alt="Apple Pay" width={30} height={20} />
                </div>
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/mada.svg" alt="Mada" width={30} height={20} />
                </div>
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/tabby.png" alt="Tabby" width={30} height={20} />
                </div>
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/tamara.png" alt="Tamara" width={30} height={20} />
                </div>
                <div className="bg-white rounded p-1">
                  <Image src="/images/payment/cod.png" alt="Cash on Delivery" width={30} height={20} />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-8 rtl:space-x-reverse">
              <Link href={getLocalizedHref('privacy')} className="text-gray-200 hover:text-white hover:underline transition mb-2 md:mb-0">
                {t('footer.privacyPolicy')}
              </Link>
              <Link href={getLocalizedHref('terms')} className="text-gray-200 hover:text-white hover:underline transition mb-2 md:mb-0">
                {t('footer.termsConditions')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-helden-purple-darker py-4">
        <div className="container mx-auto px-4 text-center text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} {t('common.brandName')}. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
      
      <div className="pt-8 mt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
} 