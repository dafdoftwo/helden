# HELDEN Online Store

A comprehensive online store specializing in women's clothing for customers in Saudi Arabia. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- Responsive design for mobile and desktop
- Multi-language support (Arabic and English)
- Product categories with filtering and sorting
- Shopping cart and checkout system
- User authentication and profiles
- Admin dashboard for product management
- Payment integration with popular Saudi payment methods
- 3D product visualization
- SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/dafdoftwo/helden.git
cd helden
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

## Deployment

The site is configured for deployment to Vercel with serverless functions handling the API routes.

To deploy:

```bash
npm run build
# Deploy to Vercel
vercel --prod
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Database and Authentication)
- Vercel (Hosting)
- Stripe (Payments)

## Admin Dashboard

Access the admin dashboard at `/admin` to manage:
- Products and categories
- Orders and inventory
- Customer accounts
- Marketing campaigns
- Analytics 