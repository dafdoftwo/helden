import React from 'react';
import CategoryPageClient from './CategoryPageClient';

// Keep the generateStaticParams function in this file
export function generateStaticParams() {
  return [
    { locale: 'en', slug: 'abayas' },
    { locale: 'ar', slug: 'abayas' },
    { locale: 'en', slug: 'dresses' },
    { locale: 'ar', slug: 'dresses' },
    { locale: 'en', slug: 'sportswear' },
    { locale: 'ar', slug: 'sportswear' }
  ];
}

// Make this the server component that renders the client component
export default function CategoryPage({ params }: { params: { locale: string, slug: string } }) {
  return <CategoryPageClient params={params} />;
} 