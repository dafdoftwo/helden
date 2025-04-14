import { MetadataRoute } from 'next';

// Force static generation for sitemap in export mode  
export const dynamic = "force-static";

// For static exports, we need to use dummy data since we can't fetch from databases
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helden-store.com';
  
  // Define static pages
  const staticPages = [
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
    // Add some dummy category pages
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
      url: `${baseUrl}/categories/accessories`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/categories/accessories`,
      lastModified: new Date(),
      priority: 0.8,
    },
    // Add some dummy product pages
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
      url: `${baseUrl}/products/summer-dress`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/products/summer-dress`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
  
  return staticPages;
} 