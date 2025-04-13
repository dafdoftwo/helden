"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiUserCheck,
  FiUserX,
  FiEdit,
  FiEye
} from 'react-icons/fi';

interface Address {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  created_at: string;
  role: string;
  is_active: boolean;
  addresses?: Address[];
  orders: Order[];
  total_spent: number;
}

interface Props {
  params: {
    id: string;
    locale: string;
  };
}

export default function CustomerDetailsPage({ params }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/customers/${params.id}`);
    }
  }, [user, authLoading, router, language, params.id]);
  
  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        
        // Fetch customer profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch customer addresses
        const { data: addressesData, error: addressesError } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', params.id);
          
        if (addressesError) throw addressesError;
        
        // Fetch customer orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, order_number, created_at, status, total_amount, payment_status')
          .eq('customer_id', params.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        // Calculate total spent
        const totalSpent = ordersData.reduce((sum, order) => {
          return sum + (order.total_amount || 0);
        }, 0);
        
        // Combine all data
        const customerData: Customer = {
          ...profileData,
          addresses: addressesData,
          orders: ordersData,
          total_spent: totalSpent
        };
        
        setCustomer(customerData);
        
      } catch (err: any) {
        console.error('Error fetching customer:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchCustomer();
    }
  }, [user, params.id]);
  
  // Open status modal
  const openStatusModal = (newStatus: boolean) => {
    setNewStatus(newStatus);
    setShowStatusModal(true);
  };
  
  // Close status modal
  const closeStatusModal = () => {
    setShowStatusModal(false);
  };
  
  // Update customer status
  const updateCustomerStatus = async () => {
    if (!customer) return;
    
    try {
      setStatusLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', customer.id);
        
      if (error) throw error;
      
      // Update local state
      setCustomer(prev => {
        if (!prev) return null;
        return { ...prev, is_active: newStatus };
      });
      
      closeStatusModal();
      
    } catch (err: any) {
      console.error('Error updating customer status:', err);
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get status color class
  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="flex items-center">
            <Link href={`/${language}/admin/customers`} className="mr-4">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">
              {customer ? `${customer.first_name} ${customer.last_name}` : t('admin.customers.customerDetails')}
            </h1>
          </div>
          
          {customer && (
            <div className="flex space-x-2">
              <Link
                href={`/${language}/admin/customers/${customer.id}/edit`}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                <FiEdit className="mr-2" />
                {t('admin.customers.edit')}
              </Link>
              {customer.is_active ? (
                <button
                  onClick={() => openStatusModal(false)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <FiUserX className="mr-2" />
                  {t('admin.customers.deactivate')}
                </button>
              ) : (
                <button
                  onClick={() => openStatusModal(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FiUserCheck className="mr-2" />
                  {t('admin.customers.activate')}
                </button>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
          </div>
        ) : !customer ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p>{t('admin.customers.customerNotFound')}</p>
            <Link 
              href={`/${language}/admin/customers`}
              className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              {t('admin.customers.backToCustomers')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{t('admin.customers.customerInfo')}</h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {customer.is_active 
                      ? t('admin.customers.active') 
                      : t('admin.customers.inactive')}
                  </span>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{customer.first_name} {customer.last_name}</h3>
                    <p className="text-gray-500 text-sm">
                      {customer.role === 'admin' ? t('admin.customers.adminRole') : t('admin.customers.customerRole')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiMail className="mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('admin.customers.email')}</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiPhone className="mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('admin.customers.phone')}</p>
                      <p className="font-medium">{customer.phone || t('admin.customers.notProvided')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiCalendar className="mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('admin.customers.memberSince')}</p>
                      <p className="font-medium">{formatDate(customer.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiPackage className="mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('admin.customers.totalOrders')}</p>
                      <p className="font-medium">{customer.orders.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiDollarSign className="mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('admin.customers.totalSpent')}</p>
                      <p className="font-medium">${customer.total_spent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Addresses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{t('admin.customers.addresses')}</h2>
                </div>
                
                {customer.addresses && customer.addresses.length > 0 ? (
                  <div className="space-y-6">
                    {customer.addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        <div className="flex items-start mb-2">
                          <FiMapPin className="mt-1 mr-2 text-gray-500" />
                          <div>
                            <p className="font-medium">{address.first_name} {address.last_name}</p>
                            <p>{address.address_line1}</p>
                            {address.address_line2 && <p>{address.address_line2}</p>}
                            <p>
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p>{address.country}</p>
                            <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('admin.customers.noAddresses')}</p>
                )}
              </div>
            </div>
            
            {/* Orders */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">{t('admin.customers.orders')}</h2>
                </div>
                
                {customer.orders.length > 0 ? (
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
                            {t('admin.orders.status')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.orders.paymentStatus')}
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.orders.total')}
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.common.actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customer.orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.order_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.payment_status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              ${order.total_amount.toFixed(2)}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    {t('admin.customers.noOrders')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Status change confirmation modal */}
      {showStatusModal && customer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {newStatus 
                ? t('admin.customers.activateConfirmTitle') 
                : t('admin.customers.deactivateConfirmTitle')}
            </h3>
            <p className="mb-6">
              {newStatus 
                ? t('admin.customers.activateConfirmText', { name: `${customer.first_name} ${customer.last_name}` }) 
                : t('admin.customers.deactivateConfirmText', { name: `${customer.first_name} ${customer.last_name}` })}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={updateCustomerStatus}
                disabled={statusLoading}
                className={`px-4 py-2 rounded-md ${
                  newStatus 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {statusLoading 
                  ? t('admin.common.processing') 
                  : newStatus 
                    ? t('admin.customers.activateButton') 
                    : t('admin.customers.deactivateButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 