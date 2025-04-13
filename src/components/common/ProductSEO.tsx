import React from 'react';
import SEO from './SEO';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  sku?: string;
  category_id?: string;
  category_name?: string;
  in_stock?: boolean;
  rating?: number;
  review_count?: number;
}

interface ProductSEOProps {
  product: Product;
  url: string;
  locale?: string;
}

// Define the product structured data type
interface ProductStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string[];
  sku: string;
  mpn: string;
  brand: {
    "@type": string;
    name: string;
  };
  offers: {
    "@type": string;
    url: string;
    priceCurrency: string;
    price: number;
    priceValidUntil: string;
    availability: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
}

export default function ProductSEO({ product, url, locale = 'en' }: ProductSEOProps) {
  const title = `${product.name} | HELDEN Store`;
  const description = product.description.length > 160 
    ? product.description.substring(0, 157) + '...' 
    : product.description;
  
  // Create keywords based on product name, category, and default store keywords
  const keywords = `${product.name}, ${product.category_name || ''}, women clothing, saudi arabia, ${locale === 'ar' ? 'عبايات, ملابس نسائية' : 'abayas, women fashion'}`;
  
  // Use the first product image for og:image
  const ogImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/images/products/default-product.jpg';
  
  // Create product schema structured data
  const structuredData: ProductStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "sku": product.sku || `SKU-${product.id}`,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "HELDEN"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "SAR",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
  
  // Add review data if available
  if (product.rating && product.review_count) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.review_count
    };
  }
  
  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      ogImage={ogImage}
      ogType="product"
      structuredData={structuredData}
      canonicalUrl={url}
    />
  );
} 