"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiEye,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiDownload
} from 'react-icons/fi';

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_method: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items_count: number;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  }[] | null;
  order_items?: {
    count: number;
  }[] | null;
}

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/orders`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Calculate pagination
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Build query
        let query = supabase
          .from('orders')
          .select(`
            id, 
            order_number, 
            created_at, 
            status, 
            total_amount, 
            payment_method,
            profiles!customer_id (first_name, last_name, email),
            order_items!orders_id_fkey(count)
          `, { count: 'exact' })
          .order('created_at', { ascending: false });
        
        // Apply status filter
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        // Apply search filter if present
        if (searchQuery) {
          query = query.or(`order_number.ilike.%${searchQuery}%, profiles.email.ilike.%${searchQuery}%, profiles.first_name.ilike.%${searchQuery}%, profiles.last_name.ilike.%${searchQuery}%`);
        }
        
        // Get total count first for pagination
        const { count, error: countError } = await query;
          
        if (countError) throw countError;
        
        // Set total pages
        if (count !== null) {
          setTotalPages(Math.ceil(count / itemsPerPage));
          setTotalOrders(count);
        }
        
        // Execute paginated query
        const { data, error } = await query.range(from, to);
          
        if (error) throw error;
        
        // Transform data to include customer name and order items count
        if (data) {
          const ordersWithData: Order[] = data.map(order => ({
            ...order,
            customer: {
              first_name: order.profiles?.[0]?.first_name || '',
              last_name: order.profiles?.[0]?.last_name || '',
              email: order.profiles?.[0]?.email || ''
            },
            order_items_count: order.order_items?.[0]?.count || 0
          }));
          
          setOrders(ordersWithData);
        }
        
        // Calculate total sales (for all orders, not just current page)
        const { data: salesData, error: salesError } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed');
          
        if (salesError) throw salesError;
        
        if (salesData) {
          const total = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
          setTotalSales(total);
        }
        
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchOrders();
    }
  }, [user, page, itemsPerPage, searchQuery, statusFilter]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
    setIsFilterOpen(false);
  };
  
  // Export orders as CSV
  const exportOrdersCSV = async () => {
    try {
      // Fetch all orders for export
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          order_number, 
          created_at, 
          status, 
          total_amount, 
          payment_method,
          shipping_address,
          billing_address,
          profiles!customer_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert(t('admin.orders.noOrdersToExport'));
        return;
      }
      
      // Prepare CSV data
      const csvHeader = [
        'Order ID',
        'Order Number',
        'Date',
        'Customer Name',
        'Email',
        'Status',
        'Payment Method',
        'Total Amount',
        'Shipping Address',
        'Billing Address'
      ].join(',');
      
      const csvRows = data.map(order => {
        const customerName = `${order.profiles?.[0]?.first_name || ''} ${order.profiles?.[0]?.last_name || ''}`.trim();
        const shippingAddress = order.shipping_address ? JSON.stringify(order.shipping_address).replace(/,/g, ' ') : '';
        const billingAddress = order.billing_address ? JSON.stringify(order.billing_address).replace(/,/g, ' ') : '';
        
        return [
          order.id,
          order.order_number,
          new Date(order.created_at).toLocaleDateString(),
          customerName,
          order.profiles?.[0]?.email || '',
          order.status,
          order.payment_method,
          order.total_amount.toFixed(2),
          `"${shippingAddress}"`,
          `"${billingAddress}"`
        ].join(',');
      });
      
      const csvContent = [csvHeader, ...csvRows].join('\n');
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err: any) {
      console.error('Error exporting orders:', err);
      setError(err.message);
    }
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
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('admin.orders.title')}</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <FiFilter className="mr-2" />
              {t('admin.orders.filter')}
            </button>
            <button
              onClick={exportOrdersCSV}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <FiDownload className="mr-2" />
              {t('admin.orders.export')}
            </button>
          </div>
        </div>
        
        {/* Filter dropdown */}
        {isFilterOpen && (
          <div className="bg-white shadow-md rounded-md p-4 mb-4 absolute right-8 z-10">
            <h3 className="font-medium mb-2">{t('admin.orders.filterByStatus')}</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="status"
                  value="all"
                  checked={statusFilter === 'all'}
                  onChange={() => handleStatusFilterChange('all')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="all" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.allOrders')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pending"
                  name="status"
                  value="pending"
                  checked={statusFilter === 'pending'}
                  onChange={() => handleStatusFilterChange('pending')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="pending" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.pending')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="processing"
                  name="status"
                  value="processing"
                  checked={statusFilter === 'processing'}
                  onChange={() => handleStatusFilterChange('processing')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="processing" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.processing')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="shipped"
                  name="status"
                  value="shipped"
                  checked={statusFilter === 'shipped'}
                  onChange={() => handleStatusFilterChange('shipped')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="shipped" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.shipped')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="delivered"
                  name="status"
                  value="delivered"
                  checked={statusFilter === 'delivered'}
                  onChange={() => handleStatusFilterChange('delivered')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="delivered" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.delivered')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="completed"
                  name="status"
                  value="completed"
                  checked={statusFilter === 'completed'}
                  onChange={() => handleStatusFilterChange('completed')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.completed')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cancelled"
                  name="status"
                  value="cancelled"
                  checked={statusFilter === 'cancelled'}
                  onChange={() => handleStatusFilterChange('cancelled')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="cancelled" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.cancelled')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="refunded"
                  name="status"
                  value="refunded"
                  checked={statusFilter === 'refunded'}
                  onChange={() => handleStatusFilterChange('refunded')}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="refunded" className="ml-2 block text-sm text-gray-700">
                  {t('admin.orders.refunded')}
                </label>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{t('admin.orders.totalOrders')}</h2>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{t('admin.orders.totalSales')}</h2>
            <p className="text-3xl font-bold">${totalSales.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={t('admin.orders.searchPlaceholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Orders table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.orderNumber')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.total')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.items')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      {t('admin.common.loading')}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery || statusFilter !== 'all'
                        ? t('admin.orders.noSearchResults')
                        : t('admin.orders.noOrders')}
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{`${order.customer.first_name} ${order.customer.last_name}`}</div>
                        <div className="text-xs text-gray-400">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed' || order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing' || order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'refunded'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${parseFloat(order.total_amount.toString()).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.order_items_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/${language}/admin/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                {t('admin.common.page')} <span className="font-medium">{page}</span> {t('admin.common.of')}{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 