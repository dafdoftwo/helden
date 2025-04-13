import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  ];

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug, updated_at');
  
  if (categoriesError) {
    console.error('Error fetching categories for sitemap:', categoriesError);
  }
  
  // Add category pages to sitemap
  const categoryPages = categories?.map(category => [
    {
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updated_at || new Date()),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/categories/${category.slug}`,
      lastModified: new Date(category.updated_at || new Date()),
      priority: 0.8,
    }
  ]).flat() || [];
  
  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug, updated_at');
  
  if (productsError) {
    console.error('Error fetching products for sitemap:', productsError);
  }
  
  // Add product pages to sitemap
  const productPages = products?.map(product => [
    {
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/products/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      priority: 0.7,
    }
  ]).flat() || [];
  
  // Combine all pages
  return [...staticPages, ...categoryPages, ...productPages];
} 