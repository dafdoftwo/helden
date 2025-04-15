/** @type {import('next').NextConfig} */
import { createSecureHeaders } from "next-secure-headers";

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  typescript: {
    // Ignore TypeScript errors during build for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build for now
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
              imgSrc: ["'self'", "data:", "https://*.supabase.co", "https://*.stripe.com"],
              scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.stripe.com"],
              connectSrc: ["'self'", "https://*.supabase.co", "https://*.stripe.com", "https://helden.vip"],
              fontSrc: ["'self'", "https://fonts.gstatic.com"],
              frameSrc: ["'self'", "https://*.stripe.com"],
            },
          },
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true },
          ],
          referrerPolicy: "strict-origin-when-cross-origin",
        }),
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'helden-store.vercel.app',
          },
        ],
        destination: 'https://helden.vip/:path*',
        permanent: true,
      },
    ];
  },

  // i18n configuration
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "ar",
    localeDetection: true,
  },

  images: {
    domains: ["helden.vip", "helden-store.vercel.app", "images.unsplash.com"],
  },

  experimental: {
    serverActions: true,
  },
};

export default nextConfig; 