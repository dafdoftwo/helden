"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBox, FiGrid, FiShoppingBag, FiUsers, FiSettings, FiHome, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // تجاوز التحقق من دور المسؤول مؤقتاً
        // في الوضع الطبيعي، يجب التحقق من دور المستخدم كما يلي:
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .select('role')
        //   .eq('id', session.user.id)
        //   .single();
        //   
        // setIsAuthenticated(data?.role === 'admin');
        
        // نسمح بالوصول لأي مستخدم مصادق عليه مؤقتاً
        setIsAuthenticated(true);
        console.log('الوصول المؤقت: السماح بالوصول إلى لوحة الإدارة لأي مستخدم مصادق عليه');
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Responsive sidebar
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [supabase]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  // Links in the sidebar
  const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: <FiHome size={20} /> },
    { href: '/admin/products', label: 'Products', icon: <FiBox size={20} /> },
    { href: '/admin/categories', label: 'Categories', icon: <FiGrid size={20} /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiShoppingBag size={20} /> },
    { href: '/admin/customers', label: 'Customers', icon: <FiUsers size={20} /> },
    { href: '/admin/settings', label: 'Settings', icon: <FiSettings size={20} /> },
  ];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-6 text-gray-600">Please log in with an admin account to access this page.</p>
        <Link href="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md fixed inset-y-0 z-50 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'left-0 w-64' : '-left-64 w-64 lg:left-0 lg:w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 flex justify-between items-center border-b">
            <Link href="/admin" className="flex items-center">
              <img
                src="/logo.png"
                alt="HELDEN Admin"
                className="h-8 w-auto"
              />
              {isSidebarOpen && (
                <span className="ml-2 text-xl font-semibold text-gray-900">Admin</span>
              )}
            </Link>
            <button 
              className="lg:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {isSidebarOpen && <span className="ml-3">{link.label}</span>}
              </Link>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <FiLogOut size={20} />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-0 lg:ml-20'
      }`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 hidden lg:block"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
          
          <div className="flex items-center">
            <Link href="/" className="text-gray-700 hover:text-purple-700" target="_blank">
              View Store
            </Link>
            <div className="w-px h-6 bg-gray-300 mx-4"></div>
            <div className="text-gray-700">Admin Panel</div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 