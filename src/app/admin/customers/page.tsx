"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiSearch, FiMail, FiEdit, FiEye } from 'react-icons/fi';
import Link from 'next/link';

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
  orders_count?: number;
  total_spent?: number;
}

export default function CustomersPage() {
  const supabase = createClientComponentClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const customersPerPage = 10;
  
  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, currentPage]);
  
  const fetchCustomers = async () => {
    setIsLoading(true);
    
    try {
      // Count total for pagination
      let countQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (searchTerm) {
        // Apply search filter to count query
        countQuery = countQuery.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (!countError) {
        setTotalCustomers(count || 0);
      }
      
      // Main query
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          created_at,
          last_sign_in_at
        `);
      
      if (searchTerm) {
        // Apply search filter
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * customersPerPage;
      const to = from + customersPerPage - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data: profilesData, error } = await query;
      
      if (error) throw error;
      
      // Fetch order summaries for each customer
      const customerIds = (profilesData || []).map(profile => profile.id);
      
      if (customerIds.length > 0) {
        // Get order counts - using a raw SQL query for aggregation
        const { data: orderCounts, error: orderCountsError } = await supabase
          .rpc('get_customer_order_counts', { user_ids: customerIds });
        
        if (orderCountsError) throw orderCountsError;
        
        // Get total spent - using a raw SQL query for aggregation
        const { data: totalSpent, error: totalSpentError } = await supabase
          .rpc('get_customer_total_spent', { user_ids: customerIds });
          
        if (totalSpentError) throw totalSpentError;
        
        // Combine the data
        const enrichedCustomers = (profilesData || []).map(profile => {
          const orderCount = orderCounts?.find(o => o.user_id === profile.id);
          const spent = totalSpent?.find(s => s.user_id === profile.id);
          
          return {
            ...profile,
            orders_count: orderCount?.count || 0,
            total_spent: spent?.sum || 0,
          };
        });
        
        setCustomers(enrichedCustomers as Customer[]);
      } else {
        setCustomers(profilesData as Customer[] || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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
    }).format(date);
  };
  
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'SAR 0.00';
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };
  
  const renderPagination = () => {
    const totalPages = Math.ceil(totalCustomers / customersPerPage);
    
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
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer base</p>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers by name or email..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Last Login</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 bg-purple-100 rounded-full overflow-hidden">
                          <div className="h-full w-full flex items-center justify-center text-purple-600 font-semibold">
                            {customer.first_name?.[0]?.toUpperCase() || customer.email[0]?.toUpperCase() || '?'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.first_name && customer.last_name 
                              ? `${customer.first_name} ${customer.last_name}`
                              : 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.phone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.last_sign_in_at ? formatDate(customer.last_sign_in_at) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.orders_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(customer.total_spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEye size={18} className="inline mr-1" /> View
                      </Link>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => window.location.href = `mailto:${customer.email}`}
                      >
                        <FiMail size={18} className="inline mr-1" /> Contact
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
} 