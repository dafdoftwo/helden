"use client";

import React, { useState, useEffect } from 'react';
import { FiBox, FiShoppingBag, FiDollarSign, FiUsers, FiEye, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  isPositive: boolean;
  linkTo: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, isPositive, linkTo }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-purple-100 p-3 rounded-lg text-purple-700">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
      <Link 
        href={linkTo} 
        className="text-purple-700 hover:underline text-sm flex items-center"
      >
        View Details <FiArrowRight className="ml-1" size={14} />
      </Link>
    </div>
  </div>
);

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch product count
        const { count: productCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch order count
        const { count: orderCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Fetch revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('total');

        const totalRevenue = revenueData?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

        // Fetch customer count
        const { count: customerCount, error: customersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch recent orders
        const { data: latestOrders, error: latestOrdersError } = await supabase
          .from('orders')
          .select(`
            id, 
            order_date,
            status,
            total,
            profiles:user_id (email, first_name, last_name)
          `)
          .order('order_date', { ascending: false })
          .limit(5);

        setStats({
          products: productCount || 0,
          orders: orderCount || 0,
          revenue: totalRevenue,
          customers: customerCount || 0,
        });

        setRecentOrders(latestOrders || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your HELDEN store admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.products}
          icon={<FiBox size={24} />}
          change="+5% from last month"
          isPositive={true}
          linkTo="/admin/products"
        />
        <StatsCard
          title="Total Orders"
          value={stats.orders}
          icon={<FiShoppingBag size={24} />}
          change="+12% from last month"
          isPositive={true}
          linkTo="/admin/orders"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          icon={<FiDollarSign size={24} />}
          change="+8% from last month"
          isPositive={true}
          linkTo="/admin/orders"
        />
        <StatsCard
          title="Total Customers"
          value={stats.customers}
          icon={<FiUsers size={24} />}
          change="+15% from last month"
          isPositive={true}
          linkTo="/admin/customers"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <Link 
            href="/admin/orders" 
            className="text-purple-700 hover:underline text-sm flex items-center"
          >
            View All <FiArrowRight className="ml-1" size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0">
                    <td className="py-4">#{order.id}</td>
                    <td className="py-4">{order.profiles?.first_name} {order.profiles?.last_name}</td>
                    <td className="py-4">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">{formatCurrency(order.total || 0)}</td>
                    <td className="py-4">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-purple-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 