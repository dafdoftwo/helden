import React from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
  noIndex?: boolean;
}

export default function SEO({
  title = 'HELDEN - Premium Women\'s Clothing in Saudi Arabia',
  description = 'Shop the latest trends in women\'s fashion at HELDEN. Premium abayas, casual wear, formal dresses, sportswear, and body shapers.',
  keywords = 'women clothing, saudi arabia, abayas, casual wear, formal dresses, sportswear, body shapers',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  structuredData,
  noIndex = false
}: SEOProps) {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  
  // Base URL for canonical and OG URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helden-store.com';
  
  // Set canonical URL if not provided
  const canonical = canonicalUrl || `${baseUrl}${locale !== 'en' ? `/${locale}` : ''}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  
  // Prepare structured data JSON
  const structuredDataJSON = structuredData 
    ? JSON.stringify(structuredData) 
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "HELDEN",
        "url": baseUrl,
        "logo": `${baseUrl}/images/logo.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+966-XXX-XXXX",
          "contactType": "customer service"
        },
        "sameAs": [
          "https://www.instagram.com/helden_store",
          "https://www.snapchat.com/add/helden_store",
          "https://www.tiktok.com/@helden_store"
        ]
      });
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
      
      {/* Robots Meta Tag */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_SA' : 'en_US'} />
      <meta property="og:site_name" content="HELDEN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      
      {/* Structured Data / JSON-LD */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJSON }}
      />
      
      {/* Alternate Language Links */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/[^/]+/, '') : ''}`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/[^/]+/, '') : ''}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/[^/]+/, '') : ''}`} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
} 