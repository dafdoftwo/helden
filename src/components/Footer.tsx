"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const { t, language, dir } = useTranslation();
  
  // Function to get path with locale
  const getLocalizedHref = (path: string): string => {
    if (path === '/') return language === 'en' ? '/' : `/${language}`;
    return language === 'en' ? `/${path}` : `/${language}/${path}`;
  };
  
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-helden-purple-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div className={`${dir === 'rtl' ? 'lg:order-4' : ''}`}>
            <h3 className="text-xl font-bold mb-6">{t('common.brandName')}</h3>
            <p className="text-gray-300 mb-6 text-sm">
              {t('footer.aboutShort')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-helden-gold transition-colors" aria-label="Facebook">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-helden-gold transition-colors" aria-label="Instagram">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-helden-gold transition-colors" aria-label="Twitter">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-helden-gold transition-colors" aria-label="LinkedIn">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className={`${dir === 'rtl' ? 'lg:order-3' : ''}`}>
            <h3 className="text-xl font-bold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalizedHref('')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('about')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('common.products')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('contact')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('common.contact')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('terms')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('footer.termsConditions')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('privacy')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className={`${dir === 'rtl' ? 'lg:order-2' : ''}`}>
            <h3 className="text-xl font-bold mb-6">{t('common.categories')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalizedHref('products/category/abayas')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('categories.abayas')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/casual')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('categories.casual')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/formal')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('categories.formal')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/sports')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('categories.sports')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('products/category/body-shapers')} className="text-gray-300 hover:text-helden-gold transition-colors text-sm">
                  {t('categories.bodyShaper')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className={`${dir === 'rtl' ? 'lg:order-1' : ''}`}>
            <h3 className="text-xl font-bold mb-6">{t('contact.getInTouch')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 text-helden-gold shrink-0 mt-0.5" />
                <span className="ml-3 rtl:mr-3 rtl:ml-0 text-gray-300 text-sm">{t('contact.address.content')}</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 text-helden-gold shrink-0" />
                <span className="ml-3 rtl:mr-3 rtl:ml-0 text-gray-300 text-sm">{t('contact.phone.content')}</span>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 text-helden-gold shrink-0" />
                <span className="ml-3 rtl:mr-3 rtl:ml-0 text-gray-300 text-sm">{t('contact.email.content')}</span>
              </li>
              <li className="flex items-start">
                <FiClock className="w-5 h-5 text-helden-gold shrink-0 mt-0.5" />
                <div className="ml-3 rtl:mr-3 rtl:ml-0 text-gray-300 text-sm">
                  <p>{t('footer.workingHours.weekdays')}</p>
                  <p>{t('footer.workingHours.weekend')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                {t('footer.paymentMethods')}
              </p>
              <div className="flex mt-2 space-x-3 rtl:space-x-reverse">
                <Image src="/images/payment/visa.png" alt="Visa" width={40} height={25} className="h-8 w-auto object-contain" />
                <Image src="/images/payment/mastercard.png" alt="Mastercard" width={40} height={25} className="h-8 w-auto object-contain" />
                <Image src="/images/payment/mada.png" alt="Mada" width={40} height={25} className="h-8 w-auto object-contain" />
                <Image src="/images/payment/apple-pay.png" alt="Apple Pay" width={40} height={25} className="h-8 w-auto object-contain" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t('footer.deliveryPartners')}
              </p>
              <div className="flex mt-2 space-x-3 rtl:space-x-reverse">
                <Image src="/images/shipping/aramex.png" alt="Aramex" width={40} height={25} className="h-8 w-auto object-contain" />
                <Image src="/images/shipping/dhl.png" alt="DHL" width={40} height={25} className="h-8 w-auto object-contain" />
                <Image src="/images/shipping/smsa.png" alt="SMSA" width={40} height={25} className="h-8 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-helden-purple-darker py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} {t('common.brandName')}. {t('footer.rightsReserved')}
            </p>
            <div className="mt-4 md:mt-0">
              <Link 
                href={getLocalizedHref('terms')} 
                className="text-gray-400 hover:text-white text-sm px-3 border-r border-gray-700 last:border-0"
              >
                {t('footer.termsConditions')}
              </Link>
              <Link 
                href={getLocalizedHref('privacy')} 
                className="text-gray-400 hover:text-white text-sm px-3 border-r border-gray-700 last:border-0"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link 
                href={getLocalizedHref('faq')} 
                className="text-gray-400 hover:text-white text-sm px-3"
              >
                {t('footer.faq')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 