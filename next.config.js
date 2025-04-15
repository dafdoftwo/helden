/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use dynamic rendering for all pages
  output: 'standalone',
  staticPageGenerationTimeout: 1000,
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'nqguyvjkbtkxsutfksuw.supabase.co',
    ],
  },
  typescript: {
    // Ignore TypeScript errors during build for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build for now
    ignoreDuringBuilds: true,
  },
  
  // Completely disable static generation
  experimental: {
    // This is to disable static file generation
    disableStaticImages: true,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.firebaseio.com https://*.googleapis.com https://*.googletagmanager.com https://*.stripe.com https://*.facebook.net; connect-src 'self' https://*.googleapis.com https://*.google-analytics.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.supabase.co https://*.stripe.com https://*.facebook.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://*.stripe.com https://*.facebook.com; object-src 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
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
};

export default nextConfig; 