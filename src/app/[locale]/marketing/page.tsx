"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

interface MarketingPageProps {
  params: {
    locale: string;
  };
}

export default function MarketingPage({ params }: MarketingPageProps) {
  const { locale } = params;
  const router = useRouter();
  const { t, dir } = useTranslation();
  const { user, loading, isAdmin } = useUser();
  
  const [newsletterStats, setNewsletterStats] = useState({
    totalSubscribers: 0,
    recentSubscribers: [],
    growthRate: 0
  });
  
  const [socialStats, setSocialStats] = useState({
    instagramFollowers: 0,
    snapchatFollowers: 0,
    tiktokFollowers: 0
  });
  
  const [activePromos, setActivePromos] = useState([]);
  const [pageStatus, setPageStatus] = useState('loading'); // loading, error, ready
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push(`/${locale}/auth/login`);
          return;
        }
        
        if (!isAdmin) {
          router.push(`/${locale}`);
          return;
        }
        
        fetchData();
      }
    };
    
    checkAdmin();
  }, [user, loading, isAdmin, locale, router]);
  
  const fetchData = async () => {
    try {
      // Fetch newsletter stats
      const { data: subscribers, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (subscribersError) throw subscribersError;
      
      // Calculate growth rate (last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const recentSubscribers = subscribers?.filter(s => 
        new Date(s.created_at) >= thirtyDaysAgo
      ) || [];
      
      const previousPeriodSubscribers = subscribers?.filter(s => 
        new Date(s.created_at) >= sixtyDaysAgo && new Date(s.created_at) < thirtyDaysAgo
      ) || [];
      
      const growthRate = previousPeriodSubscribers.length === 0 
        ? recentSubscribers.length * 100 // If no previous subscribers, show full growth
        : (recentSubscribers.length - previousPeriodSubscribers.length) / previousPeriodSubscribers.length * 100;
      
      setNewsletterStats({
        totalSubscribers: subscribers?.length || 0,
        recentSubscribers: recentSubscribers.slice(0, 5),
        growthRate
      });
      
      // Fetch social media stats (this would typically come from an API integration)
      // For demo purposes, we're using placeholder data
      setSocialStats({
        instagramFollowers: 1245,
        snapchatFollowers: 876,
        tiktokFollowers: 2390
      });
      
      // Fetch active promotions
      const { data: promos, error: promosError } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (promosError) throw promosError;
      
      setActivePromos(promos || []);
      setPageStatus('ready');
      
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      setPageStatus('error');
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: locale === 'ar' ? ar : enUS
      });
    } catch (e) {
      return dateString;
    }
  };
  
  if (pageStatus === 'loading' || loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activeItem="marketing" params={params} />
        <div className="flex-1 p-10">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-helden-purple"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (pageStatus === 'error') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activeItem="marketing" params={params} />
        <div className="flex-1 p-10">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {t('marketing.errorLoading')}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-helden-purple text-white rounded hover:bg-helden-purple-dark"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100" dir={dir}>
      <AdminSidebar activeItem="marketing" params={params} />
      <div className="flex-1 p-5 md:p-10">
        <h1 className="text-2xl font-bold mb-6">{t('marketing.title')}</h1>
        
        {/* Main marketing dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Newsletter Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-500">{t('marketing.newsletterSubscribers')}</h3>
                <p className="text-3xl font-bold">{newsletterStats.totalSubscribers}</p>
              </div>
              <Link 
                href={`/${locale}/marketing/newsletter`}
                className="px-3 py-1 bg-helden-purple text-white text-sm rounded"
              >
                {t('marketing.manage')}
              </Link>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className={`text-sm ${newsletterStats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {newsletterStats.growthRate >= 0 ? '↑' : '↓'} {Math.abs(newsletterStats.growthRate).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {t('marketing.last30Days')}
                </span>
              </div>
            </div>
            {newsletterStats.recentSubscribers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">{t('marketing.recentSubscribers')}</h4>
                <ul className="space-y-2">
                  {newsletterStats.recentSubscribers.map((subscriber: any) => (
                    <li key={subscriber.id} className="text-sm flex justify-between">
                      <span className="truncate">{subscriber.email}</span>
                      <span className="text-gray-500 text-xs">{formatDate(subscriber.created_at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Social Media Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-500">{t('marketing.socialMedia')}</h3>
                <p className="text-3xl font-bold">{socialStats.instagramFollowers + socialStats.snapchatFollowers + socialStats.tiktokFollowers}</p>
              </div>
              <Link 
                href={`/${locale}/marketing/social`}
                className="px-3 py-1 bg-helden-purple text-white text-sm rounded"
              >
                {t('marketing.manage')}
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="ml-1 text-sm">Instagram</span>
                </div>
                <p className="mt-1 text-lg font-semibold">{socialStats.instagramFollowers}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 15.694c-.512.237-1.045.426-1.586.557-2.463.6-4.986-.6-6.396-2.739-.525-.763-.914-1.693-.793-2.609.117-.908.661-1.312 1.354-1.71.156-.09.336-.099.512-.05.175.049.324.151.417.311.168.291.326.589.5.859.143.22.123.458-.011.67-.087.138-.185.27-.283.402-.126.169-.136.342-.024.518.575.907 1.525 1.5 2.595 1.6.226.021.445-.066.579-.243.168-.224.335-.449.478-.692.124-.212.299-.335.536-.345.19-.008.371.035.518.159.343.287.676.584 1.011.883.213.189.332.433.345.715.01.26-.124.476-.317.669-.691.693-1.539 1.048-2.435 1.045z"/>
                  </svg>
                  <span className="ml-1 text-sm">Snapchat</span>
                </div>
                <p className="mt-1 text-lg font-semibold">{socialStats.snapchatFollowers}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span className="ml-1 text-sm">TikTok</span>
                </div>
                <p className="mt-1 text-lg font-semibold">{socialStats.tiktokFollowers}</p>
              </div>
            </div>
          </div>
          
          {/* Promotions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-500">{t('marketing.activePromotions')}</h3>
                <p className="text-3xl font-bold">{activePromos.length}</p>
              </div>
              <Link 
                href={`/${locale}/marketing/promotions`}
                className="px-3 py-1 bg-helden-purple text-white text-sm rounded"
              >
                {t('marketing.manage')}
              </Link>
            </div>
            {activePromos.length > 0 ? (
              <div className="mt-4">
                <ul className="space-y-3">
                  {activePromos.map((promo: any) => (
                    <li key={promo.id} className="border rounded p-2 text-sm">
                      <div className="font-medium">{promo.title}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {promo.discount_type === 'percentage' 
                            ? `${promo.discount_value}% OFF` 
                            : `${promo.discount_value} ${t('common.currency')} OFF`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {promo.end_date ? `${t('marketing.expires')}: ${new Date(promo.end_date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}` : t('marketing.noExpiry')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 text-center py-4 border border-dashed rounded">
                <p className="text-sm text-gray-500">{t('marketing.noActivePromotions')}</p>
                <Link 
                  href={`/${locale}/marketing/promotions/new`}
                  className="inline-block mt-2 px-3 py-1 bg-helden-purple text-white text-sm rounded"
                >
                  {t('marketing.createNew')}
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Marketing Tools */}
        <h2 className="text-xl font-semibold mb-4">{t('marketing.tools')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href={`/${locale}/marketing/newsletter`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-helden-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('marketing.newsletter')}</h3>
              <p className="text-gray-600 text-sm">{t('marketing.newsletterDesc')}</p>
            </div>
          </Link>
          
          <Link href={`/${locale}/marketing/social`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('marketing.socialMedia')}</h3>
              <p className="text-gray-600 text-sm">{t('marketing.socialMediaDesc')}</p>
            </div>
          </Link>
          
          <Link href={`/${locale}/marketing/promotions`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('marketing.promotions')}</h3>
              <p className="text-gray-600 text-sm">{t('marketing.promotionsDesc')}</p>
            </div>
          </Link>
          
          <Link href={`/${locale}/marketing/analytics`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('marketing.analytics')}</h3>
              <p className="text-gray-600 text-sm">{t('marketing.analyticsDesc')}</p>
            </div>
          </Link>
          
          <Link href={`/${locale}/marketing/seo`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('marketing.seo')}</h3>
              <p className="text-gray-600 text-sm">{t('marketing.seoDesc')}</p>
            </div>
          </Link>
          
          <Link href={`/${locale}/marketing/automation`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('marketing.automation')}</h3>
              <p className="text-gray-600 text-sm">{t('marketing.automationDesc')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 