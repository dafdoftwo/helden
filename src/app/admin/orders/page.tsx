"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiEye, FiFilter, FiSearch, FiCalendar } from 'react-icons/fi';

interface Order {
  id: number;
  user_id: string;
  order_date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  shipping_address?: any;
  payment_method?: string;
  profiles?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

export default function OrdersPage() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;
  
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, dateRangeStart, dateRangeEnd, currentPage]);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    
    try {
      // Count total for pagination
      let countQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      // Apply filters to count query
      if (statusFilter) {
        countQuery = countQuery.eq('status', statusFilter);
      }
      
      if (dateRangeStart) {
        countQuery = countQuery.gte('order_date', dateRangeStart);
      }
      
      if (dateRangeEnd) {
        countQuery = countQuery.lte('order_date', `${dateRangeEnd}T23:59:59`);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (!countError) {
        setTotalOrders(count || 0);
      }
      
      // Main query with filters
      let query = supabase
        .from('orders')
        .select(`
          id,
          user_id,
          order_date,
          status,
          total,
          shipping_address,
          payment_method,
          profiles:user_id (
            email,
            first_name,
            last_name
          )
        `);
      
      // Apply filters
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (dateRangeStart) {
        query = query.gte('order_date', dateRangeStart);
      }
      
      if (dateRangeEnd) {
        query = query.lte('order_date', `${dateRangeEnd}T23:59:59`);
      }
      
      if (searchTerm) {
        // This assumes you have a properly indexed search or a search column
        // For demo purposes, we'll use a simple search approach
        // In production, use a dedicated search column or full-text search
        query = query.or(`user_id.eq.${searchTerm},id.eq.${searchTerm}`);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * ordersPerPage;
      const to = from + ordersPerPage - 1;
      
      query = query
        .order('order_date', { ascending: false })
        .range(from, to);
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Type assertion to handle the Supabase response structure
      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderPagination = () => {
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show current page in the middle when possible
            let pageNum = currentPage;
            if (currentPage < 3) {
              pageNum = i + 1;
            } else if (currentPage > totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            // Skip rendering if page number is out of range
            if (pageNum < 1 || pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track all orders</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          {/* Date Range - Start */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              placeholder="Date from"
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
            />
          </div>
          
          {/* Date Range - End */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              placeholder="Date to"
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.profiles?.first_name} {order.profiles?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.profiles?.email || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEye size={18} className="inline mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
} 