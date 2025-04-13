"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  FiDollarSign, 
  FiUsers, 
  FiShoppingBag, 
  FiClock,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  productCount: number;
  lowStockCount: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    productCount: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  // Check admin access
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch stats data
        const [
          { count: orderCount }, 
          { count: customerCount },
          { count: pendingCount },
          { count: productCount },
          { count: lowStockCount },
          { data: recentOrdersData }
        ] = await Promise.all([
          // Total orders
          supabase
            .from('orders')
            .select('*', { count: 'exact', head: true }),
          
          // Total customers
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }),
          
          // Pending orders
          supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),
          
          // Total products
          supabase
            .from('products')
            .select('*', { count: 'exact', head: true }),
          
          // Low stock products
          supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .lt('stock', 5),
          
          // Recent orders
          supabase
            .from('orders')
            .select(`
              id,
              created_at,
              total_amount,
              status,
              profiles:user_id (
                first_name,
                last_name,
                email
              )
            `)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);
        
        // Calculate total sales from orders
        const { data: salesData, error: salesError } = await supabase
          .from('orders')
          .select('total_amount');
        
        let totalSales = 0;
        if (salesData && !salesError) {
          totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        }
        
        setStats({
          totalSales,
          totalOrders: orderCount || 0,
          totalCustomers: customerCount || 0,
          pendingOrders: pendingCount || 0,
          productCount: productCount || 0,
          lowStockCount: lowStockCount || 0
        });
        
        if (recentOrdersData) {
          setRecentOrders(recentOrdersData);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard.title')}</h1>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Total Sales */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('admin.dashboard.totalSales')}</p>
                    <h3 className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FiDollarSign className="h-6 w-6 text-green-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <FiTrendingUp className="text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">{t('admin.dashboard.fromLastMonth')}</span>
                </div>
              </div>
              
              {/* Total Orders */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('admin.dashboard.totalOrders')}</p>
                    <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiShoppingBag className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <FiTrendingUp className="text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+5.2%</span>
                  <span className="text-gray-500 ml-1">{t('admin.dashboard.fromLastMonth')}</span>
                </div>
              </div>
              
              {/* Total Customers */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('admin.dashboard.customers')}</p>
                    <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FiUsers className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <FiTrendingUp className="text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+7.8%</span>
                  <span className="text-gray-500 ml-1">{t('admin.dashboard.fromLastMonth')}</span>
                </div>
              </div>
              
              {/* Pending Orders */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('admin.dashboard.pendingOrders')}</p>
                    <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FiClock className="h-6 w-6 text-yellow-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <FiTrendingDown className="text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">+3.1%</span>
                  <span className="text-gray-500 ml-1">{t('admin.dashboard.fromLastMonth')}</span>
                </div>
              </div>
              
              {/* Total Products */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('admin.dashboard.products')}</p>
                    <h3 className="text-2xl font-bold">{stats.productCount}</h3>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FiShoppingBag className="h-6 w-6 text-indigo-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <FiTrendingUp className="text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+2.3%</span>
                  <span className="text-gray-500 ml-1">{t('admin.dashboard.newProducts')}</span>
                </div>
              </div>
              
              {/* Low Stock */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('admin.dashboard.lowStock')}</p>
                    <h3 className="text-2xl font-bold">{stats.lowStockCount}</h3>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <FiShoppingBag className="h-6 w-6 text-red-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-700">{t('admin.dashboard.needsRestock')}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{t('admin.dashboard.recentOrders')}</h2>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {t('admin.dashboard.noRecentOrders')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.orderID')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.customer')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.date')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.amount')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.profiles.first_name} {order.profiles.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.total_amount?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">{t('admin.dashboard.quickActions')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => router.push(`/${language}/admin/products/add`)}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                >
                  {t('admin.dashboard.addProduct')}
                </button>
                <button 
                  onClick={() => router.push(`/${language}/admin/orders?status=pending`)}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                >
                  {t('admin.dashboard.viewPendingOrders')}
                </button>
                <button 
                  onClick={() => router.push(`/${language}/admin/products?stock=low`)}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                >
                  {t('admin.dashboard.viewLowStock')}
                </button>
                <button 
                  onClick={() => router.push(`/${language}/admin/settings`)}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                >
                  {t('admin.dashboard.editSettings')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 