import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// List of supported locales
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar'],
};

// Get the preferred locale directly from the request's accept-language header
// This is a simplified version that doesn't rely on external libraries
function getLocale(request: NextRequest): string {
  // Default to English
  const defaultLocale = i18n.defaultLocale;
  
  try {
    // Get accept-language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    
    // Check if Arabic is preferred
    if (acceptLanguage.includes('ar')) {
      return 'ar';
    }
    
    // Otherwise return English or any other locale if we add more later
    return defaultLocale;
  } catch (error) {
    console.error('Error determining locale:', error);
    return defaultLocale;
  }
}

// Create a Supabase client for auth checks
const createServerSupabaseClient = (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Check if Supabase credentials are available
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials are missing. Please check your environment variables.');
    throw new Error('supabaseUrl and supabaseKey are required');
  }
  
  // Create a cookies instance
  const cookies = Object.fromEntries(
    request.cookies.getAll().map(cookie => [cookie.name, cookie.value])
  );
  
  // Create a Supabase client
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'pkce',
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: Object.entries(cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; '),
      },
    },
  });
};

// Define the paths that require authentication
const protectedPaths = ['/account', '/orders', '/checkout', '/wishlist', '/profile'];

// Define paths that should redirect authenticated users (like login pages)
const authOnlyPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

// Define paths that should be excluded from locale handling
const excludedPaths = ['/_next/', '/api/', '/static/', '/images/', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/manifest.json'];

// Check if a path is a protected route
function isProtectedRoute(pathname: string): boolean {
  // Strip the locale from the pathname for matching
  const path = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
  return protectedPaths.some(route => path.startsWith(route));
}

// Check if a path should redirect authenticated users
function isAuthOnlyRoute(pathname: string): boolean {
  // Strip the locale from the pathname for matching
  const path = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
  return authOnlyPaths.some(route => path.startsWith(route));
}

// Check if a path should be excluded from locale handling
function isExcludedPath(pathname: string): boolean {
  return excludedPaths.some(path => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip excluded paths
  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }
  
  // Handle paths without locale - redirect to the correct locale version
  // Main domain (/) should be English, /ar/... should be Arabic
  if (pathname === '/') {
    // Homepage without locale - defaults to English
    return NextResponse.next();
  } else if (pathname.startsWith('/ar')) {
    // Already has Arabic locale, proceed
    return NextResponse.next();
  } else if (pathname.startsWith('/en')) {
    // Already has English locale, proceed
    return NextResponse.next();
  } else {
    // No locale prefix - redirect based on user preference
    const preferredLocale = getLocale(request);
    
    // Build the new path with locale prefix
    const newPath = preferredLocale === 'ar' 
      ? `/ar${pathname.startsWith('/') ? pathname : `/${pathname}`}`
      : `/en${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    
    // Redirect to the localized URL
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // Extract locale from path
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = pathParts[0];
  
  try {
    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials missing, skipping auth check');
      return NextResponse.next();
    }

    // Initialize the Supabase client
    const supabase = createServerSupabaseClient(request);
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    // Handle protected routes
    if (isProtectedRoute(pathname)) {
      // If not authenticated, redirect to login
      if (!session) {
        const returnUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(new URL(`/${locale}/auth/login?returnUrl=${returnUrl}`, request.url));
      }
    }
    
    // Handle auth-only routes (redirect authenticated users away from login/register/etc)
    if (isAuthOnlyRoute(pathname) && session) {
      // If authenticated, redirect to account page
      return NextResponse.redirect(new URL(`/${locale}/account`, request.url));
    }
  } catch (error) {
    console.error('Auth check error:', error);
    
    // Only redirect to login if this is a protected route
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` routes
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}; 