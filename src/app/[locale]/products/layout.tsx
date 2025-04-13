"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import Link from 'next/link';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, dir } = useTranslation();

  // Categories from translations
  const categories = [
    { id: 'abayas', name: 'categories.abayas' },
    { id: 'casual', name: 'categories.casual' },
    { id: 'formal', name: 'categories.formal' },
    { id: 'sports', name: 'categories.sports' },
    { id: 'bodyShaper', name: 'categories.bodyShaper' },
  ];

  return (
    <div className="bg-helden-gradient min-h-screen" dir={dir}>
      {/* Navigation Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-helden-purple"
              >
                {t('common.home')}
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/products"
                  className="text-sm font-medium text-gray-700 hover:text-helden-purple"
                >
                  {t('common.allProducts')}
                </Link>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Sidebar and Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 lg:pr-8 mb-8 lg:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-bold mb-4">{t('common.categories')}</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="block py-2 px-3 rounded hover:bg-helden-purple-light hover:text-white transition-colors"
                  >
                    {t('common.allProducts')}
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products/category/${category.id}`}
                      className="block py-2 px-3 rounded hover:bg-helden-purple-light hover:text-white transition-colors"
                    >
                      {t(category.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 