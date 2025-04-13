"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  Users,
  ShoppingBag,
  CreditCard,
  DollarSign
} from 'lucide-react';

interface AnalyticsPageProps {
  params: {
    locale: string;
  };
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CustomerData {
  date: string;
  new_customers: number;
  repeat_customers: number;
}

export default function AnalyticsPage({ params: { locale } }: AnalyticsPageProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    repeatPurchaseRate: 0
  });

  // Color palette for charts
  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/${locale}/auth/login?redirect=/admin`);
        return;
      }
      
      // Check for admin role
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (error || !userData || userData.role !== 'admin') {
        // Not an admin, redirect to home
        router.push(`/${locale}`);
        return;
      }
      
      fetchAnalyticsData();
    };
    
    checkAdminAuth();
  }, [locale, router, timeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Get date ranges based on timeframe
      const { startDate, endDate, interval } = getDateRange(timeframe);
      
      // Fetch sales data
      await fetchSalesData(startDate, endDate, interval);
      
      // Fetch category distribution
      await fetchCategoryData();
      
      // Fetch customer acquisition data
      await fetchCustomerData(startDate, endDate, interval);
      
      // Fetch key metrics
      await fetchKeyMetrics();
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (timeframe: 'week' | 'month' | 'year') => {
    const endDate = new Date();
    let startDate = new Date();
    let interval: 'day' | 'week' | 'month' = 'day';
    
    if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
      interval = 'day';
    } else if (timeframe === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
      interval = 'day';
    } else if (timeframe === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
      interval = 'month';
    }
    
    return { 
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0],
      interval
    };
  };

  const fetchSalesData = async (startDate: string, endDate: string, interval: string) => {
    // In a real application, this would query the database with proper date grouping
    // For demonstration, we'll generate sample data
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('id, total, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');
    
    if (error) {
      console.error('Error fetching sales data:', error);
      return;
    }
    
    // Process the data into daily/weekly/monthly buckets
    const processedData: { [key: string]: SalesData } = {};
    
    // Generate all dates in range to ensure no gaps
    const dates = generateDateRange(startDate, endDate, interval);
    dates.forEach(date => {
      processedData[date] = { date, revenue: 0, orders: 0 };
    });
    
    // Fill with actual data
    ordersData.forEach(order => {
      const orderDate = new Date(order.created_at);
      let dateKey;
      
      if (interval === 'day') {
        dateKey = orderDate.toISOString().split('T')[0];
      } else if (interval === 'week') {
        // Get the week number
        const weekNumber = getWeekNumber(orderDate);
        dateKey = `Week ${weekNumber}`;
      } else if (interval === 'month') {
        dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (processedData[dateKey]) {
        processedData[dateKey].revenue += order.total || 0;
        processedData[dateKey].orders += 1;
      } else {
        processedData[dateKey] = {
          date: dateKey,
          revenue: order.total || 0,
          orders: 1
        };
      }
    });
    
    // Convert to array and sort by date
    const result = Object.values(processedData).sort((a, b) => a.date.localeCompare(b.date));
    setSalesData(result);
  };

  const fetchCategoryData = async () => {
    // Fetch products grouped by category
    const { data, error } = await supabase
      .from('products')
      .select('category_id');
      
    if (error) {
      console.error('Error fetching category data:', error);
      return;
    }
    
    // Count products by category
    const categoryCounts: { [key: number]: number } = {};
    data.forEach(product => {
      const categoryId = product.category_id || 0;
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    });
    
    // Get category names
    const categoryResults: CategoryData[] = [];
    for (const [categoryId, count] of Object.entries(categoryCounts)) {
      const { data: categoryInfo, error: categoryError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', categoryId)
        .single();
        
      if (!categoryError && categoryInfo) {
        categoryResults.push({
          name: categoryInfo.name,
          value: count,
          color: COLORS[categoryResults.length % COLORS.length]
        });
      } else {
        categoryResults.push({
          name: 'Uncategorized',
          value: count,
          color: COLORS[categoryResults.length % COLORS.length]
        });
      }
    }
    
    setCategoryData(categoryResults);
  };

  const fetchCustomerData = async (startDate: string, endDate: string, interval: string) => {
    // Get new vs returning customers data
    // In a real app, you'd query the database with proper analytics queries
    
    // For demonstration, we'll generate sample data
    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('id, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
      
    if (error) {
      console.error('Error fetching customer data:', error);
      return;
    }
    
    // Process new customers by date
    const newCustomersByDate: { [key: string]: number } = {};
    
    // Generate all dates in range to ensure no gaps
    const dates = generateDateRange(startDate, endDate, interval);
    dates.forEach(date => {
      newCustomersByDate[date] = 0;
    });
    
    // Fill with actual data
    profilesData.forEach(profile => {
      const creationDate = new Date(profile.created_at);
      let dateKey;
      
      if (interval === 'day') {
        dateKey = creationDate.toISOString().split('T')[0];
      } else if (interval === 'week') {
        const weekNumber = getWeekNumber(creationDate);
        dateKey = `Week ${weekNumber}`;
      } else if (interval === 'month') {
        dateKey = `${creationDate.getFullYear()}-${String(creationDate.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (newCustomersByDate[dateKey] !== undefined) {
        newCustomersByDate[dateKey] += 1;
      }
    });
    
    // Convert to array format for the charts
    const customerData = Object.entries(newCustomersByDate).map(([date, count]) => ({
      date,
      new_customers: count,
      repeat_customers: Math.floor(count * 0.3) // Mock data for repeat customers
    }));
    
    setCustomerData(customerData.sort((a, b) => a.date.localeCompare(b.date)));
  };

  const fetchKeyMetrics = async () => {
    // In a real app, these would be calculated from actual data
    
    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total');
      
    if (!revenueError && revenueData) {
      const totalRevenue = revenueData.reduce((sum, order) => sum + (order.total || 0), 0);
      const averageOrderValue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;
      
      setMetrics({
        totalRevenue,
        averageOrderValue,
        conversionRate: 3.5, // Mock data
        repeatPurchaseRate: 28 // Mock data - percentage
      });
    }
  };

  // Helper function to generate a range of dates
  const generateDateRange = (startDate: string, endDate: string, interval: string) => {
    const result: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (interval === 'day') {
      const current = new Date(start);
      while (current <= end) {
        result.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    } else if (interval === 'week') {
      // Get all weeks in the range
      let currentWeek = getWeekNumber(start);
      const endWeek = getWeekNumber(end);
      
      while (currentWeek <= endWeek) {
        result.push(`Week ${currentWeek}`);
        currentWeek++;
      }
    } else if (interval === 'month') {
      const startYear = start.getFullYear();
      const startMonth = start.getMonth();
      const endYear = end.getFullYear();
      const endMonth = end.getMonth();
      
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = (year === startYear) ? startMonth : 0;
        const monthEnd = (year === endYear) ? endMonth : 11;
        
        for (let month = monthStart; month <= monthEnd; month++) {
          result.push(`${year}-${String(month + 1).padStart(2, '0')}`);
        }
      }
    }
    
    return result;
  };

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-helden-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('analytics')}</h1>
        
        <div className="relative">
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 cursor-pointer">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {timeframe === 'week' ? t('last_7_days') : 
               timeframe === 'month' ? t('last_30_days') : 
               t('last_12_months')}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden">
            <div className="py-1">
              <button 
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setTimeframe('week')}
              >
                {t('last_7_days')}
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setTimeframe('month')}
              >
                {t('last_30_days')}
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setTimeframe('year')}
              >
                {t('last_12_months')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('total_revenue')}</p>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('average_order')}</p>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(metrics.averageOrderValue)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('conversion_rate')}</p>
              <p className="text-2xl font-semibold mt-1">{metrics.conversionRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('repeat_purchase')}</p>
              <p className="text-2xl font-semibold mt-1">{metrics.repeatPurchaseRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">{t('sales_trend')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Format date based on timeframe
                    if (timeframe === 'year' && value.includes('-')) {
                      const [year, month] = value.split('-');
                      return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(month) - 1]} ${year}`;
                    }
                    return value;
                  }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value} SAR`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`${value} SAR`, t('revenue')];
                    return [value, t('orders')];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  name={t('revenue')}
                  stroke="#8b5cf6" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  name={t('orders')}
                  stroke="#3b82f6" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">{t('category_distribution')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Customer Acquisition */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">{t('customer_acquisition')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Format date based on timeframe
                    if (timeframe === 'year' && value.includes('-')) {
                      const [year, month] = value.split('-');
                      return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(month) - 1]} ${year}`;
                    }
                    return value;
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="new_customers" 
                  name={t('new_customers')}
                  fill="#8b5cf6" 
                  stackId="a"
                />
                <Bar 
                  dataKey="repeat_customers" 
                  name={t('repeat_customers')}
                  fill="#3b82f6" 
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">{t('top_products')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Embroidered Abaya', sales: 126 },
                  { name: 'Casual Blouse', sales: 92 },
                  { name: 'Formal Dress', sales: 88 },
                  { name: 'Sports Set', sales: 76 },
                  { name: 'Premium Hijab', sales: 68 }
                ]}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value, name) => [value, t('units_sold')]}
                />
                <Bar 
                  dataKey="sales" 
                  name={t('units_sold')}
                  fill="#10b981" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 