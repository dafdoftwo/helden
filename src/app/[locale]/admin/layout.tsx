"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Truck, 
  Tag, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function AdminLayout({ children, params: { locale } }: AdminLayoutProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Check if user is authenticated and has admin role
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/${locale}/auth/login?redirect=/admin`);
        return;
      }
      
      // Check for admin role
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (error || !userData || userData.role !== 'admin') {
        // Not an admin, redirect to home
        router.push(`/${locale}`);
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };
    
    checkUser();
  }, [router, locale]);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  // Active link check
  const isActive = (path: string) => {
    return pathname.includes(`/${locale}/admin/${path}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-helden-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
          <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
            <h1 className="text-xl font-bold text-helden-purple">HELDEN {t('admin')}</h1>
          </div>
          <button 
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-6 px-2">
          <Link 
            href={`/${locale}/admin`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              pathname === `/${locale}/admin` 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span className="ml-3">{t('dashboard')}</span>}
          </Link>
          
          <Link 
            href={`/${locale}/admin/orders`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              isActive('orders') 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <ShoppingBag size={20} />
            {sidebarOpen && <span className="ml-3">{t('orders')}</span>}
          </Link>
          
          <Link 
            href={`/${locale}/admin/products`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              isActive('products') 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Tag size={20} />
            {sidebarOpen && <span className="ml-3">{t('products')}</span>}
          </Link>
          
          <Link 
            href={`/${locale}/admin/customers`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              isActive('customers') 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">{t('customers')}</span>}
          </Link>
          
          <Link 
            href={`/${locale}/admin/shipping`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              isActive('shipping') 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Truck size={20} />
            {sidebarOpen && <span className="ml-3">{t('shipping')}</span>}
          </Link>
          
          <Link 
            href={`/${locale}/admin/analytics`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              isActive('analytics') 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span className="ml-3">{t('analytics')}</span>}
          </Link>
          
          <Link 
            href={`/${locale}/admin/settings`}
            className={`flex items-center p-3 mb-2 rounded-md ${
              isActive('settings') 
                ? 'bg-helden-purple text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-3">{t('settings')}</span>}
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 mb-2 rounded-md w-full text-left hover:bg-gray-100 mt-auto"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">{t('logout')}</span>}
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        <header className="bg-white shadow h-16 flex items-center px-6">
          <h2 className="text-xl font-medium text-gray-800">
            {pathname === `/${locale}/admin` ? t('dashboard') : 
             pathname.includes('/orders') ? t('orders') :
             pathname.includes('/products') ? t('products') :
             pathname.includes('/customers') ? t('customers') :
             pathname.includes('/shipping') ? t('shipping') :
             pathname.includes('/analytics') ? t('analytics') :
             pathname.includes('/settings') ? t('settings') : ''}
          </h2>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 