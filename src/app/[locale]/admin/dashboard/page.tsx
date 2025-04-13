"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiTrendingUp,
  FiShoppingBag,
  FiUsers, 
  FiAlertTriangle,
  FiBarChart2,
  FiDollarSign,
  FiActivity,
  FiPackage,
  FiClock,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi';

// Define types for dashboard data
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockItems: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  pendingOrders: number;
  salesByCategory: {
    category: string;
    sales: number;
  }[];
  recentOrders: {
    id: string;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }[];
  lowStockProducts: {
    id: number;
    name: string;
    stock: number;
    min_stock_threshold: number | null;
    category: string;
  }[];
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
    pendingOrders: 0,
    salesByCategory: [],
    recentOrders: [],
    lowStockProducts: []
  });
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/dashboard`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch dashboard data when user is loaded or time range changes
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, timeRange]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected time range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      const startDateStr = startDate.toISOString();
      
      // Previous period for comparison
      const previousPeriodStart = new Date(startDate);
      const currentPeriodLength = now.getTime() - startDate.getTime();
      previousPeriodStart.setTime(previousPeriodStart.getTime() - currentPeriodLength);
      const previousPeriodStartStr = previousPeriodStart.toISOString();
      
      // Fetch total revenue and orders for current period
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, total_amount, created_at')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: false });
      
      if (orderError) throw orderError;
      
      // Fetch total revenue and orders for previous period (for comparison)
      const { data: previousOrderData, error: previousOrderError } = await supabase
        .from('orders')
        .select('id, total_amount')
        .gte('created_at', previousPeriodStartStr)
        .lt('created_at', startDateStr);
      
      if (previousOrderError) throw previousOrderError;
      
      // Calculate revenue, orders and changes
      const totalRevenue = orderData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalOrders = orderData?.length || 0;
      const previousRevenue = previousOrderData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const previousOrders = previousOrderData?.length || 0;
      
      const revenueChange = previousRevenue === 0 
        ? 100 
        : Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100);
      
      const ordersChange = previousOrders === 0 
        ? 100 
        : Math.round(((totalOrders - previousOrders) / previousOrders) * 100);
      
      const averageOrderValue = totalOrders === 0 
        ? 0 
        : Math.round((totalRevenue / totalOrders) * 100) / 100;
      
      // Fetch total customers
      const { count: customerCount, error: customerError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      if (customerError) throw customerError;
      
      // Fetch pending orders
      const { count: pendingCount, error: pendingError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Fetch low stock products
      const { data: lowStockData, error: lowStockError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          stock,
          min_stock_threshold,
          category:categories(name)
        `)
        .lt('stock', 10)
        .gt('stock', 0)
        .order('stock', { ascending: true })
        .limit(5);
      
      if (lowStockError) throw lowStockError;
      
      // Format low stock products
      const lowStockProducts = lowStockData?.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        min_stock_threshold: product.min_stock_threshold,
        category: typeof product.category === 'object' && product.category !== null ? 
          (product.category as any).name || 'Unknown' : 'Unknown'
      })) || [];
      
      // Fetch recent orders with customer details
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          user_id,
          profiles:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentOrdersError) throw recentOrdersError;
      
      // Format recent orders
      const recentOrders = recentOrdersData?.map(order => ({
        id: order.id,
        order_number: order.order_number || `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        customer_name: order.profiles ? 
          `${(order.profiles as any).first_name || ''} ${(order.profiles as any).last_name || ''}`.trim() || 'Guest' 
          : 'Guest',
        total: order.total_amount,
        status: order.status,
        created_at: order.created_at
      })) || [];
      
      // Fetch sales by category
      const { data: categorySalesData, error: categorySalesError } = await supabase
        .rpc('get_sales_by_category', { start_date: startDateStr });
      
      if (categorySalesError) throw categorySalesError;
      
      // Format category sales
      const salesByCategory = categorySalesData || [];
      
      // Set all dashboard data
      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: customerCount || 0,
        lowStockItems: lowStockProducts.length,
        averageOrderValue,
        revenueChange,
        ordersChange,
        pendingOrders: pendingCount || 0,
        salesByCategory,
        recentOrders,
        lowStockProducts
      });
      
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
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
      
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.dashboard.title')}</h1>
            <p className="text-gray-600">{t('admin.dashboard.welcome')}, {user.user_metadata?.first_name || user.email}</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex space-x-1 bg-white border border-gray-300 rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1.5 text-sm rounded-l-md ${
                  timeRange === 'today' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('admin.dashboard.today')}
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1.5 text-sm ${
                  timeRange === 'week' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('admin.dashboard.week')}
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 text-sm ${
                  timeRange === 'month' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('admin.dashboard.month')}
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1.5 text-sm rounded-r-md ${
                  timeRange === 'year' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('admin.dashboard.year')}
              </button>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-100"
            >
              <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('admin.dashboard.refresh')}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('admin.dashboard.totalRevenue')}</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiDollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className={`mt-2 text-sm font-medium ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="flex items-center">
                    <FiTrendingUp className="mr-1" />
                    {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% {t('admin.dashboard.fromPrevious')}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('admin.dashboard.totalOrders')}</p>
                    <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className={`mt-2 text-sm font-medium ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="flex items-center">
                    <FiTrendingUp className="mr-1" />
                    {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}% {t('admin.dashboard.fromPrevious')}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('admin.dashboard.averageOrder')}</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(stats.averageOrderValue)}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiBarChart2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">
                  <span className="flex items-center">
                    <FiActivity className="mr-1" />
                    {t('admin.dashboard.perOrder')}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('admin.dashboard.pendingOrders')}</p>
                    <p className="text-2xl font-bold mt-2">{stats.pendingOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiClock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">
                  <Link href={`/${language}/admin/orders?status=pending`} className="flex items-center text-blue-600 hover:underline">
                    <FiEye className="mr-1" />
                    {t('admin.dashboard.viewPending')}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent orders */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{t('admin.dashboard.recentOrders')}</h3>
                    <Link href={`/${language}/admin/orders`} className="text-sm text-blue-600 hover:underline">
                      {t('admin.dashboard.viewAll')}
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.orderNumber')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.customer')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.date')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.total')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dashboard.status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            {t('admin.dashboard.noRecentOrders')}
                          </td>
                        </tr>
                      ) : (
                        stats.recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/${language}/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                                {order.order_number}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.customer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(order.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                  'bg-gray-100 text-gray-800'}`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Low stock items */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{t('admin.dashboard.lowStockItems')}</h3>
                    <Link href={`/${language}/admin/inventory?filter=low_stock`} className="text-sm text-blue-600 hover:underline">
                      {t('admin.dashboard.viewAll')}
                    </Link>
                  </div>
                </div>
                <div>
                  {stats.lowStockProducts.length === 0 ? (
                    <div className="px-6 py-4 text-center text-gray-500">
                      {t('admin.dashboard.noLowStockItems')}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {stats.lowStockProducts.map(product => (
                        <li key={product.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex justify-between">
                            <div>
                              <Link href={`/${language}/admin/products/edit/${product.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                                {product.name}
                              </Link>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                <FiAlertTriangle className="h-4 w-4 text-red-600" />
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{product.stock} {t('admin.dashboard.left')}</p>
                                <p className="text-xs text-gray-500">
                                  {t('admin.dashboard.threshold')}: {product.min_stock_threshold || 5}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            {/* Category sales */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">{t('admin.dashboard.salesByCategory')}</h3>
              </div>
              <div className="p-6">
                {stats.salesByCategory.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    {t('admin.dashboard.noSalesData')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.salesByCategory.map((category, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">{category.category || t('admin.dashboard.uncategorized')}</h4>
                          <span className="text-blue-600 font-bold">{formatCurrency(category.sales)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (category.sales / Math.max(...stats.salesByCategory.map(c => c.sales))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 