import React from 'react';

interface OrganizationStructuredDataProps {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    item: string;
    position: number;
  }[];
}

export const OrganizationStructuredData: React.FC<OrganizationStructuredDataProps> = ({
  name,
  url,
  logo,
  sameAs = [],
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  name,
  description,
  image,
  sku,
  brand,
  offers,
  aggregateRating,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      ...offers,
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ...aggregateRating,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({
  items,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default {
  OrganizationStructuredData,
  ProductStructuredData,
  BreadcrumbStructuredData,
}; 