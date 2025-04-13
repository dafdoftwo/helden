"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiUser, FiMail, FiPhone, FiCalendar, FiPackage, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  products: any[]; // Simplified for the example
}

interface CustomerDetails {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
  orders?: Order[];
  orders_count?: number;
  total_spent?: number;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const supabase = createClientComponentClient();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);
  
  const fetchCustomerDetails = async () => {
    setIsLoading(true);
    
    try {
      // Get customer profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          created_at,
          last_sign_in_at
        `)
        .eq('id', customerId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get customer orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total,
          products
        `)
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });
      
      if (orderError) throw orderError;
      
      // Calculate summary info
      const totalSpent = orderData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      
      setCustomer({
        ...profileData,
        orders: orderData || [],
        orders_count: orderData?.length || 0,
        total_spent: totalSpent
      });
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'SAR 0.00';
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        <Link href="/admin/customers" className="text-purple-600 hover:text-purple-800 mt-4 inline-block">
          Back to Customers
        </Link>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/admin/customers" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Customers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.first_name && customer.last_name 
              ? `${customer.first_name} ${customer.last_name}`
              : customer.email}
          </h1>
          <p className="text-gray-600 mt-1">Customer ID: {customer.id}</p>
        </div>
        
        <div>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => window.location.href = `mailto:${customer.email}`}
          >
            <FiMail className="inline mr-2" /> Contact Customer
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders ({customer.orders_count})
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiUser className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {customer.first_name && customer.last_name 
                      ? `${customer.first_name} ${customer.last_name}`
                      : 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiMail className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiPhone className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiCalendar className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Customer Since</p>
                  <p className="font-medium">{formatDate(customer.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiCalendar className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Last Sign In</p>
                  <p className="font-medium">
                    {customer.last_sign_in_at ? formatDate(customer.last_sign_in_at) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <FiPackage className="text-purple-500 mb-2" size={24} />
                <p className="text-2xl font-bold">{customer.orders_count}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <FiDollarSign className="text-green-500 mb-2" size={24} />
                <p className="text-2xl font-bold">{formatCurrency(customer.total_spent)}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              
              {customer.orders && customer.orders.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <FiCalendar className="text-blue-500 mb-2" size={24} />
                  <p className="text-lg font-bold">
                    {formatDate(customer.orders[0].created_at).split(',')[0]}
                  </p>
                  <p className="text-sm text-gray-600">Last Order Date</p>
                </div>
              )}
              
              {customer.orders && customer.orders.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <FiDollarSign className="text-yellow-500 mb-2" size={24} />
                  <p className="text-lg font-bold">
                    {formatCurrency(customer.orders[0].total)}
                  </p>
                  <p className="text-sm text-gray-600">Last Order Amount</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {customer.orders && customer.orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Items</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customer.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.products?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found for this customer</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 