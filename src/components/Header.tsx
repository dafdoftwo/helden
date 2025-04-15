"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import CartIcon from './CartIcon';
import { usePathname } from 'next/navigation';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const { t, language } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Primary navigation items
  const primaryNavItems = [
    { name: t('common.home'), href: getLocalizedHref('') },
    { name: t('common.products'), href: getLocalizedHref('products'), 
      submenu: [
        { name: t('categories.abayas'), href: getLocalizedHref('products/category/abayas') },
        { name: t('categories.casual'), href: getLocalizedHref('products/category/casual') },
        { name: t('categories.formal'), href: getLocalizedHref('products/category/formal') },
        { name: t('categories.sports'), href: getLocalizedHref('products/category/sports') },
        { name: t('categories.bodyShaper'), href: getLocalizedHref('products/category/body-shapers') },
      ]
    },
    { name: t('common.about'), href: getLocalizedHref('about') },
    { name: t('common.contact'), href: getLocalizedHref('contact') },
  ];

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/' || href === '/ar') return pathname === '/' || pathname === '/ar' || pathname === '/en';
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
            {primaryNavItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link 
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-helden-purple-dark border-b-2 border-helden-purple'
                      : 'text-gray-700 hover:text-helden-purple'
                  }`}
                >
                  {item.name}
                  {item.submenu && (
                    <span className="ml-1">▼</span>
                  )}
                </Link>
                
                {/* Dropdown for submenu */}
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link 
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-helden-purple-lighter hover:text-helden-purple-dark transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              className="text-gray-700 hover:text-helden-purple transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={t('common.search')}
            >
              <FiSearch className="h-5 w-5" />
            </button>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Account Link */}
            <Link 
              href={getLocalizedHref('account')} 
              className="text-gray-700 hover:text-helden-purple transition-colors"
              aria-label={t('common.account')}
            >
              <FiUser className="h-5 w-5" />
            </Link>
            
            {/* Wishlist Link */}
            <Link 
              href={getLocalizedHref('wishlist')} 
              className="text-gray-700 hover:text-helden-purple transition-colors"
              aria-label={t('common.wishlist')}
            >
              <FiHeart className="h-5 w-5" />
            </Link>
            
            {/* Cart */}
            <CartIcon />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 hover:text-helden-purple"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Search Bar (Conditionally Rendered) */}
        {searchOpen && (
          <div className="py-4 border-t mt-4 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-helden-purple focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-helden-purple">
                <FiSearch className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-4 animate-fadeIn">
            <ul className="space-y-4">
              {primaryNavItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`block text-base font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? 'text-helden-purple-dark'
                        : 'text-gray-700 hover:text-helden-purple'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <ul className="ml-4 mt-2 space-y-2 border-l-2 border-helden-purple-lighter pl-4">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <Link 
                            href={subItem.href}
                            className="block text-sm text-gray-600 hover:text-helden-purple"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              
              {/* Additional mobile-only navigation items */}
              <li className="border-t pt-4 mt-4">
                <Link 
                  href={getLocalizedHref('account')}
                  className="flex items-center text-gray-700 hover:text-helden-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="mr-2" />
                  {t('common.account')}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('wishlist')}
                  className="flex items-center text-gray-700 hover:text-helden-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHeart className="mr-2" />
                  {t('common.wishlist')}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 