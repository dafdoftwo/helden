import { NextResponse, NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Define available locales and a default locale
export const locales = ['en', 'ar'];
export const defaultLocale = 'ar';

// Helper function to get locale from request
function getLocale(request: NextRequest): string {
  // Check for locale in the URL
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;

  // Otherwise, negotiate based on Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  return matchLocale(languages, locales, defaultLocale);
}

// Define which routes are considered protected (requiring authentication)
function isProtectedRoute(pathname: string): boolean {
  return [
    '/account', 
    '/checkout',
    '/orders',
    '/admin',
    '/wishlist'
  ].some(route => pathname.startsWith(`/${route}`) || pathname === route);
}

// Define routes that should only be accessed when NOT authenticated
function isAuthOnlyRoute(pathname: string): boolean {
  return [
    '/auth/login',
    '/auth/register',
    '/auth/reset-password'
  ].some(route => pathname.startsWith(`/${route}`) || pathname === route);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle root path - redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if the pathname already includes a locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Handle paths that don't have a locale prefix
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url)
    );
  }

  // Extract locale from pathname for further processing
  const locale = pathname.split('/')[1];

  // Skip auth checks for non-HTML requests (e.g., API routes, static assets)
  if (
    pathname.startsWith('/api/') ||
    pathname.match(/\.(jpg|jpeg|png|webp|gif|svg|ico|css|js|json)$/)
  ) {
    return NextResponse.next();
  }

  // For protected routes, we'd normally check auth
  // Since we removed Supabase, we're just going to let requests through
  // In a real app, you would replace this with your new auth mechanism
  
  // Mock authentication check - could be replaced with your new auth system
  // For now, we'll just allow all requests through
  
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and static files
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};