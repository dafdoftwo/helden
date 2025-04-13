"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { supabase, getCurrentUser } from '@/lib/supabase';

// Admin components
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ReportsPageProps {
  params: {
    locale: string;
  };
}

export default function ReportsPage({ params }: ReportsPageProps) {
  const { t, language, dir } = useTranslation();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    monthlySales: [] as {month: string, total: number}[],
    topProducts: [] as {name: string, total: number, quantity: number}[],
    ordersByStatus: [] as {status: string, count: number}[],
    recentOrders: [] as any[],
  });
  const [timeRange, setTimeRange] = useState('30days');
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push(`/${params.locale}/auth/login`);
          return;
        }
        
        // Check if user has admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
          
        if (!profile || profile.role !== 'admin') {
          // Not an admin, redirect to homepage
          router.push(`/${params.locale}`);
          return;
        }
        
        // Load statistics
        fetchStatistics();
      } catch (error) {
        console.error('Error checking admin auth:', error);
      }
    };
    
    checkAdminAuth();
  }, [params.locale, router, timeRange]);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Set date range
      const today = new Date();
      const fromDate = new Date();
      
      switch (timeRange) {
        case '7days':
          fromDate.setDate(today.getDate() - 7);
          break;
        case '30days':
          fromDate.setDate(today.getDate() - 30);
          break;
        case '90days':
          fromDate.setDate(today.getDate() - 90);
          break;
        case 'year':
          fromDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          fromDate.setDate(today.getDate() - 30);
      }
      
      // Format dates for Supabase query
      const fromDateStr = fromDate.toISOString();
      const toDateStr = today.toISOString();
      
      // Get total sales and orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, total, status, order_date')
        .gte('order_date', fromDateStr)
        .lte('order_date', toDateStr)
        .not('status', 'eq', 'cancelled');
      
      if (orderError) throw orderError;
      
      const totalSales = orderData?.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0) || 0;
      const totalOrders = orderData?.length || 0;
      const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;
      
      // Get orders by status
      const statusCounts: Record<string, number> = {};
      orderData?.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });
      
      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      })).sort((a, b) => b.count - a.count);
      
      // Get total customers
      const { count: customerCount, error: customerError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .not('role', 'eq', 'admin');
      
      if (customerError) throw customerError;
      
      // Get monthly sales data
      const monthlySales: {month: string, total: number}[] = [];
      const monthNames = language === 'ar' ? 
        ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] : 
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Create a map for monthly sales
      const salesByMonth: Record<string, number> = {};
      
      // Initialize with zero values for the past months based on time range
      const monthsToShow = timeRange === 'year' ? 12 : 6;
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthLabel = `${monthNames[date.getMonth()]} ${timeRange === 'year' ? date.getFullYear() : ''}`;
        salesByMonth[monthKey] = 0;
        monthlySales.push({ month: monthLabel, total: 0 });
      }
      
      // Fill in actual sales data
      orderData?.forEach(order => {
        const orderDate = new Date(order.order_date);
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
        if (salesByMonth.hasOwnProperty(monthKey)) {
          salesByMonth[monthKey] += parseFloat(order.total || '0');
        }
      });
      
      // Update the monthlySales array with real values
      let monthIndex = 0;
      for (const [monthKey, total] of Object.entries(salesByMonth)) {
        if (monthIndex < monthlySales.length) {
          monthlySales[monthIndex].total = total;
          monthIndex++;
        }
      }
      
      // Get top selling products
      const { data: topProductsData, error: topProductsError } = await supabase
        .from('order_items')
        .select(`
          quantity, price,
          products:products(id, name)
        `)
        .gte('created_at', fromDateStr)
        .lte('created_at', toDateStr);
      
      if (topProductsError) throw topProductsError;
      
      const productSales: Record<string, {name: string, total: number, quantity: number}> = {};
      
      topProductsData?.forEach(item => {
        const productId = item.products ? (item.products as any).id : undefined;
        const productName = item.products ? (item.products as any).name || 'Unknown Product' : 'Unknown Product';
        const total = parseFloat(item.price || '0') * (item.quantity || 0);
        
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = { name: productName, total: 0, quantity: 0 };
          }
          productSales[productId].total += total;
          productSales[productId].quantity += item.quantity || 0;
        }
      });
      
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      
      // Get recent orders
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select(`
          id, total, status, order_date,
          profiles:profiles(email, user_metadata)
        `)
        .order('order_date', { ascending: false })
        .limit(5);
      
      if (recentOrdersError) throw recentOrdersError;
      
      // Compile all statistics
      setStats({
        totalSales,
        totalOrders,
        totalCustomers: customerCount || 0,
        averageOrderValue,
        monthlySales,
        topProducts,
        ordersByStatus,
        recentOrders: recentOrdersData || [],
      });
      
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-SA' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };
  
  // Helper to generate random pastel colors for charts
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'rgb(253, 230, 138)';
      case 'processing': return 'rgb(147, 197, 253)';
      case 'shipped': return 'rgb(167, 139, 250)';
      case 'delivered': return 'rgb(110, 231, 183)';
      case 'completed': return 'rgb(52, 211, 153)';
      case 'cancelled': return 'rgb(252, 165, 165)';
      default: return `rgb(${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55})`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100" dir={dir}>
      <div className="flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <AdminSidebar activePage="reports" locale={params.locale} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                {t('admin.reports.title')}
              </h1>
              
              <div className="flex space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-helden-purple focus:ring focus:ring-helden-purple focus:ring-opacity-50"
                >
                  <option value="7days">{t('admin.reports.last7Days')}</option>
                  <option value="30days">{t('admin.reports.last30Days')}</option>
                  <option value="90days">{t('admin.reports.last90Days')}</option>
                  <option value="year">{t('admin.reports.lastYear')}</option>
                </select>
                
                <button
                  onClick={fetchStatistics}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple"
                >
                  {t('admin.reports.refresh')}
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="p-10 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-helden-purple"></div>
                <p className="mt-2 text-gray-500">{t('admin.loading')}</p>
              </div>
            ) : (
              <>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Sales Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-teal-100 text-teal-500 me-4">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('admin.reports.totalSales')}</p>
                        <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.totalSales)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Orders Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 me-4">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('admin.reports.totalOrders')}</p>
                        <p className="text-xl font-semibold text-gray-900">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Average Order Value Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-500 me-4">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('admin.reports.averageOrder')}</p>
                        <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Customers Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-pink-100 text-pink-500 me-4">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('admin.reports.totalCustomers')}</p>
                        <p className="text-xl font-semibold text-gray-900">{stats.totalCustomers}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Monthly Sales Chart */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.reports.monthlySales')}</h2>
                    <div className="h-80 w-full">
                      <div className="flex flex-col h-full">
                        <div className="flex-1 flex items-end">
                          <div className="flex h-full w-full items-end space-x-2">
                            {stats.monthlySales.map((item, index) => {
                              const maxValue = Math.max(...stats.monthlySales.map(s => s.total));
                              const height = maxValue ? (item.total / maxValue) * 100 : 0;
                              return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-full bg-helden-purple rounded-t" 
                                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                                  ></div>
                                  <div className="text-xs font-medium text-gray-500 mt-2">
                                    {item.month}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex justify-between mt-4">
                          <div className="text-sm text-gray-500">
                            {t('admin.reports.totalForPeriod')}: {formatCurrency(stats.totalSales)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Orders by Status */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.reports.ordersByStatus')}</h2>
                    <div className="h-80 flex items-center justify-center">
                      {stats.ordersByStatus.length === 0 ? (
                        <p className="text-gray-500">{t('admin.reports.noData')}</p>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="relative h-48 w-48">
                            <svg viewBox="0 0 100 100" className="h-full w-full">
                              {stats.ordersByStatus.reduce((elements, item, index, array) => {
                                const total = array.reduce((sum, i) => sum + i.count, 0);
                                const percentage = (item.count / total) * 100;
                                
                                if (percentage === 0) return elements;
                                
                                // Calculate the start and end angles
                                const totalPercentageBefore = array
                                  .slice(0, index)
                                  .reduce((sum, i) => sum + (i.count / total) * 100, 0);
                                
                                const startAngle = (totalPercentageBefore / 100) * 360;
                                const endAngle = ((totalPercentageBefore + percentage) / 100) * 360;
                                
                                // Convert to radians and calculate coordinates
                                const startRad = (startAngle - 90) * (Math.PI / 180);
                                const endRad = (endAngle - 90) * (Math.PI / 180);
                                
                                const x1 = 50 + 50 * Math.cos(startRad);
                                const y1 = 50 + 50 * Math.sin(startRad);
                                const x2 = 50 + 50 * Math.cos(endRad);
                                const y2 = 50 + 50 * Math.sin(endRad);
                                
                                // Determine the large arc flag
                                const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
                                
                                // Create a path for the pie slice
                                const path = `
                                  M 50 50
                                  L ${x1} ${y1}
                                  A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
                                  Z
                                `;
                                
                                const color = getStatusColor(item.status);
                                
                                elements.push(
                                  <path
                                    key={index}
                                    d={path}
                                    fill={color}
                                    stroke="#fff"
                                    strokeWidth="0.5"
                                  />
                                );
                                
                                return elements;
                              }, [] as React.ReactNode[])}
                            </svg>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                            {stats.ordersByStatus.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full me-2"
                                  style={{ backgroundColor: getStatusColor(item.status) }}
                                ></div>
                                <span className="text-xs text-gray-600">
                                  {t(`admin.orders.statuses.${item.status}`)} ({item.count})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Products */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.reports.topProducts')}</h2>
                    {stats.topProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">{t('admin.reports.noData')}</p>
                    ) : (
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.product')}
                              </th>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.quantity')}
                              </th>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.revenue')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stats.topProducts.map((product, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {product.name}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {product.quantity}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(product.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  
                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.reports.recentOrders')}</h2>
                    {stats.recentOrders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">{t('admin.reports.noData')}</p>
                    ) : (
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.order')}
                              </th>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.customer')}
                              </th>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.date')}
                              </th>
                              <th className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.reports.total')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recentOrders.map((order, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-helden-purple">
                                  <a href={`/${params.locale}/admin/orders/${order.id}`}>
                                    #{order.id}
                                  </a>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.profiles?.user_metadata?.full_name || order.profiles?.email || t('admin.orders.guestCustomer')}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(order.order_date)}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(parseFloat(order.total || '0'))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 