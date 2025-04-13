"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import CartIcon from './CartIcon';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { t, language } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to get path with locale
  const getLocalizedHref = (path: string): string => {
    if (path === '/') return language === 'en' ? '/' : `/${language}`;
    return language === 'en' ? `/${path}` : `/${language}/${path}`;
  };

  // Navigation items with proper links
  const navigationItems = [
    { name: t('common.home'), href: getLocalizedHref('') },
    { name: t('common.products'), href: getLocalizedHref('products') },
    { name: t('categories.abayas'), href: getLocalizedHref('products/category/abayas') },
    { name: t('categories.casual'), href: getLocalizedHref('products/category/casual') },
    { name: t('categories.formal'), href: getLocalizedHref('products/category/formal') },
    { name: t('categories.sports'), href: getLocalizedHref('products/category/sports') },
    { name: t('categories.bodyShaper'), href: getLocalizedHref('products/category/body-shapers') },
  ];

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/en';
    return pathname.includes(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={getLocalizedHref('')} className="flex items-center">
            <div className="text-3xl font-bold text-helden-purple-dark">{t('common.brandName')}</div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'text-helden-purple-dark border-b-2 border-helden-purple'
                    : 'text-gray-700 hover:text-helden-purple'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Link 
              href={getLocalizedHref('account')} 
              className="text-gray-700 hover:text-helden-purple"
              aria-label={t('common.account')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            
            <Link 
              href={getLocalizedHref('wishlist')} 
              className="text-gray-700 hover:text-helden-purple"
              aria-label={t('common.wishlist')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            
            <CartIcon />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-4">
            <ul className="space-y-4">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`block text-sm font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? 'text-helden-purple-dark'
                        : 'text-gray-700 hover:text-helden-purple'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 