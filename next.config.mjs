/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
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
};

export default nextConfig; 