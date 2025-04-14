import { MetadataRoute } from 'next';

// Force static generation for robots.txt in export mode
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helden-store.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/dashboard/',
        '/account/reset-password',
        '/checkout/success',
        '/checkout/cancel',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 