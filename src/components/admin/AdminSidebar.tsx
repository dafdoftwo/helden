"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiFileText, 
  FiSettings,
  FiGrid,
  FiTag,
  FiLogOut,
  FiBox,
  FiLayers
} from 'react-icons/fi';
import { TbView360 } from 'react-icons/tb';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t, language } = useTranslation();
  const { signOut } = useAuth();
  
  const routes = [
    {
      name: t('admin.sidebar.dashboard'),
      href: `/${language}/admin`,
      icon: <FiHome className="w-5 h-5" />
    },
    {
      name: t('admin.sidebar.products'),
      href: `/${language}/admin/products`,
      icon: <FiShoppingBag className="w-5 h-5" />
    },
    {
      name: t('admin.sidebar.3dAssets'),
      href: `/${language}/admin/products/3d-assets`,
      icon: <TbView360 className="w-5 h-5" />,
      indent: true
    },
    {
      name: t('admin.sidebar.categories'),
      href: `/${language}/admin/categories`,
      icon: <FiGrid className="w-5 h-5" />
    },
    {
      name: t('admin.sidebar.orders'),
      href: `/${language}/admin/orders`,
      icon: <FiFileText className="w-5 h-5" />
    },
    {
      name: t('admin.sidebar.customers'),
      href: `/${language}/admin/customers`,
      icon: <FiUsers className="w-5 h-5" />
    },
    {
      name: t('admin.sidebar.discounts'),
      href: `/${language}/admin/discounts`,
      icon: <FiTag className="w-5 h-5" />
    },
    {
      name: t('admin.sidebar.settings'),
      href: `/${language}/admin/settings`,
      icon: <FiSettings className="w-5 h-5" />
    }
  ];

  const isActiveRoute = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <Link href={`/${language}`} className="flex items-center">
            <span className="text-xl font-bold text-black">
              Helden Admin
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                route.indent ? 'ml-6' : ''
              } ${
                isActiveRoute(route.href)
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{route.icon}</span>
              {route.name}
            </Link>
          ))}
          
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-4 py-3 mt-6 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            {t('admin.sidebar.logout')}
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>© 2023 Helden Store</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
} 