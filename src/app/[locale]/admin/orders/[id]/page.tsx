"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft,
  FiPackage,
  FiMail,
  FiPrinter,
  FiDownload
} from 'react-icons/fi';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product_id: number;
  variant_id?: number | null;
  product: {
    id: number;
    name: string;
    slug: string;
    main_image: string;
  };
  variant?: {
    id: number;
    color: string;
    size: string;
  } | null;
}

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
  payment_method: string;
  payment_status: string;
  notes?: string | null;
  shipping_address: Address;
  billing_address: Address;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items: OrderItem[];
  tracking_number?: string | null;
  shipping_method?: string | null;
}

interface Props {
  params: {
    id: string;
    locale: string;
  };
}

export default function OrderDetailsPage({ params }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [updatedOrder, setUpdatedOrder] = useState({
    status: '',
    payment_status: '',
    tracking_number: '',
    notes: '',
    shipping_method: ''
  });
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/orders/${params.id}`);
    }
  }, [user, authLoading, router, language, params.id]);
  
  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, 
            order_number, 
            created_at, 
            status, 
            total_amount, 
            payment_method,
            payment_status,
            shipping_method,
            tracking_number,
            notes,
            shipping_address,
            billing_address,
            profiles!customer_id (id, first_name, last_name, email),
            order_items!orders_id_fkey (
              id,
              quantity,
              price,
              product_id,
              variant_id,
              products!product_id (
                id,
                name,
                slug,
                main_image
              ),
              product_variants!variant_id (
                id,
                color,
                size
              )
            )
          `)
          .eq('id', params.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform data to the Order interface
          const orderData: Order = {
            ...data,
            customer: {
              id: data.profiles?.[0]?.id || '',
              first_name: data.profiles?.[0]?.first_name || '',
              last_name: data.profiles?.[0]?.last_name || '',
              email: data.profiles?.[0]?.email || ''
            },
            order_items: data.order_items.map((item: any) => ({
              ...item,
              product: item.products,
              variant: item.product_variants?.[0] || null
            }))
          };
          
          setOrder(orderData);
          
          // Initialize the update form with current values
          setUpdatedOrder({
            status: orderData.status,
            payment_status: orderData.payment_status,
            tracking_number: orderData.tracking_number || '',
            notes: orderData.notes || '',
            shipping_method: orderData.shipping_method || ''
          });
        }
        
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchOrder();
    }
  }, [user, params.id]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle order update
  const handleUpdateOrder = async () => {
    try {
      setStatusLoading(true);
      
      const { error } = await supabase
        .from('orders')
        .update({
          status: updatedOrder.status,
          payment_status: updatedOrder.payment_status,
          tracking_number: updatedOrder.tracking_number || null,
          notes: updatedOrder.notes || null,
          shipping_method: updatedOrder.shipping_method || null
        })
        .eq('id', params.id);
        
      if (error) throw error;
      
      // Update the local state with the new values
      if (order) {
        setOrder({
          ...order,
          status: updatedOrder.status,
          payment_status: updatedOrder.payment_status,
          tracking_number: updatedOrder.tracking_number || null,
          notes: updatedOrder.notes || null,
          shipping_method: updatedOrder.shipping_method || null
        });
      }
      
      setSuccessMessage(t('admin.orders.updateSuccess'));
      setEditMode(false);
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error updating order:', err);
      setError(err.message);
      
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setStatusLoading(false);
    }
  };
  
  // Handle print invoice
  const handlePrintInvoice = () => {
    window.print();
  };
  
  // Get status color class
  const getStatusClass = (status: string) => {
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
  
  // Generate PDF invoice (placeholder function)
  const handleExportInvoice = () => {
    alert('This feature would generate a PDF invoice for download');
    // In real implementation, you'd generate a PDF and initiate a download
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
            <Link href={`/${language}/admin/orders`} className="mr-4">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">
              {t('admin.orders.orderDetails')} {order?.order_number}
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrintInvoice}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <FiPrinter className="mr-2" />
              {t('admin.orders.printInvoice')}
            </button>
            <button
              onClick={handleExportInvoice}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <FiDownload className="mr-2" />
              {t('admin.orders.exportInvoice')}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 text-green-800 p-4 mb-4 rounded-md">
            {successMessage}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p>{t('admin.orders.orderNotFound')}</p>
            <Link 
              href={`/${language}/admin/orders`}
              className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              {t('admin.orders.backToOrders')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{t('admin.orders.orderSummary')}</h2>
                      <p className="text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        {t('admin.orders.paymentStatus')}: {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.orders.product')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.orders.quantity')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.orders.unitPrice')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.orders.totalPrice')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.order_items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                {item.product.main_image ? (
                                  <Image
                                    src={item.product.main_image}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                    <FiPackage className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </div>
                                {item.variant && (
                                  <div className="text-xs text-gray-500">
                                    {item.variant.color && `${t('admin.products.color')}: ${item.variant.color}`}
                                    {item.variant.color && item.variant.size && ', '}
                                    {item.variant.size && `${t('admin.products.size')}: ${item.variant.size}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${parseFloat(item.price.toString()).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">
                          {t('admin.orders.subtotal')}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium">
                          ${order.total_amount.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">
                          {t('admin.orders.shipping')}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium">
                          $0.00
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">
                          {t('admin.orders.tax')}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-200">
                        <td colSpan={3} className="px-6 py-4 text-base text-right font-semibold">
                          {t('admin.orders.total')}
                        </td>
                        <td className="px-6 py-4 text-base text-right font-semibold">
                          ${order.total_amount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Shipping and Billing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('admin.orders.shippingInfo')}</h3>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </p>
                    <p>{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    <p>{order.shipping_address.phone}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('admin.orders.billingInfo')}</h3>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.billing_address.first_name} {order.billing_address.last_name}
                    </p>
                    <p>{order.billing_address.address_line1}</p>
                    {order.billing_address.address_line2 && <p>{order.billing_address.address_line2}</p>}
                    <p>
                      {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                    </p>
                    <p>{order.billing_address.country}</p>
                    <p>{order.billing_address.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {(order.notes || editMode) && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('admin.orders.notes')}</h3>
                  {editMode ? (
                    <textarea
                      name="notes"
                      value={updatedOrder.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder={t('admin.orders.notesPlaceholder')}
                    />
                  ) : (
                    <p className="text-gray-600">{order.notes || t('admin.orders.noNotes')}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Customer and Order Management */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('admin.orders.customerInfo')}</h3>
                <div className="space-y-3">
                  <p className="font-medium">{order.customer.first_name} {order.customer.last_name}</p>
                  <div className="flex items-center">
                    <FiMail className="text-gray-500 mr-2" />
                    <a href={`mailto:${order.customer.email}`} className="text-blue-600 hover:underline">
                      {order.customer.email}
                    </a>
                  </div>
                  <Link
                    href={`/${language}/admin/customers/${order.customer.id}`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    {t('admin.orders.viewCustomerProfile')}
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('admin.orders.orderManagement')}</h3>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                    >
                      {t('admin.common.edit')}
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                    >
                      {t('admin.common.cancel')}
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.orders.status')}
                    </label>
                    {editMode ? (
                      <select
                        name="status"
                        value={updatedOrder.status}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="pending">{t('admin.orders.pending')}</option>
                        <option value="processing">{t('admin.orders.processing')}</option>
                        <option value="shipped">{t('admin.orders.shipped')}</option>
                        <option value="delivered">{t('admin.orders.delivered')}</option>
                        <option value="completed">{t('admin.orders.completed')}</option>
                        <option value="cancelled">{t('admin.orders.cancelled')}</option>
                        <option value="refunded">{t('admin.orders.refunded')}</option>
                      </select>
                    ) : (
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                        {order.status}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.orders.paymentStatus')}
                    </label>
                    {editMode ? (
                      <select
                        name="payment_status"
                        value={updatedOrder.payment_status}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="pending">{t('admin.orders.paymentPending')}</option>
                        <option value="paid">{t('admin.orders.paymentPaid')}</option>
                        <option value="failed">{t('admin.orders.paymentFailed')}</option>
                        <option value="refunded">{t('admin.orders.paymentRefunded')}</option>
                      </select>
                    ) : (
                      <span className="text-gray-800">{order.payment_status}</span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.orders.paymentMethod')}
                    </label>
                    <span className="text-gray-800">{order.payment_method}</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.orders.shippingMethod')}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="shipping_method"
                        value={updatedOrder.shipping_method}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder={t('admin.orders.shippingMethodPlaceholder')}
                      />
                    ) : (
                      <span className="text-gray-800">{order.shipping_method || t('admin.orders.notSpecified')}</span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.orders.trackingNumber')}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="tracking_number"
                        value={updatedOrder.tracking_number}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder={t('admin.orders.trackingNumberPlaceholder')}
                      />
                    ) : (
                      <span className="text-gray-800">{order.tracking_number || t('admin.orders.notSpecified')}</span>
                    )}
                  </div>
                  
                  {editMode && (
                    <button
                      onClick={handleUpdateOrder}
                      disabled={statusLoading}
                      className="w-full mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {statusLoading ? t('admin.common.updating') : t('admin.common.updateOrder')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 