import { MetadataRoute } from 'next';

// Static sitemap that doesn't rely on database queries
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helden-ef55f.web.app';
  
  // Define static pages
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/about`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/contact`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/products`,
      lastModified: new Date(),
      priority: 0.9,
    },
    // Hard-coded category pages
    {
      url: `${baseUrl}/categories/abayas`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/categories/abayas`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories/dresses`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/categories/dresses`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories/sportswear`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/categories/sportswear`,
      lastModified: new Date(),
      priority: 0.8,
    },
    // Hard-coded product pages
    {
      url: `${baseUrl}/products/elegant-abaya`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/products/elegant-abaya`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products/casual-dress`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/products/casual-dress`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products/workout-set`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/products/workout-set`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
} 