'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Mail } from 'lucide-react'

interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string
  created_at: string
  total_orders: number
  total_spent: number
  last_order_date?: string
}

interface CustomersPageProps {
  params: {
    locale: string
  }
}

export default function CustomersManagement({ params }: CustomersPageProps) {
  const t = useTranslations('Admin')
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [totalCustomers, setTotalCustomers] = useState(0)

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Check if user is admin
        // Redirect if not admin
      } catch (error) {
        console.error('Error checking admin auth:', error)
        router.push(`/${params.locale}`)
      }
    }
    
    checkAdminAuth()
    fetchCustomers()
  }, [params.locale, router, sortField, sortDirection])
  
  // Filter customers based on search
  useEffect(() => {
    let result = customers
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(customer => 
        customer.full_name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        (customer.phone && customer.phone.includes(search))
      )
    }
    
    setFilteredCustomers(result)
    setCurrentPage(1) // Reset to first page on filter change
  }, [searchTerm, customers])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      
      // First get all customer profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .order(sortField, { ascending: sortDirection === 'asc' })
      
      if (profilesError) throw profilesError

      // For each user, get their order statistics
      const enhancedCustomers = await Promise.all(profilesData.map(async (profile) => {
        // Get total orders and total spent
        const { data: orderStats, error: orderStatsError } = await supabase
          .from('orders')
          .select('id, total, created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
        
        if (orderStatsError) {
          console.error('Error fetching orders for user:', profile.id, orderStatsError)
          return {
            ...profile,
            total_orders: 0,
            total_spent: 0
          }
        }

        const total_orders = orderStats.length
        const total_spent = orderStats.reduce((sum, order) => sum + (order.total || 0), 0)
        const last_order_date = orderStats.length > 0 ? orderStats[0].created_at : undefined

        return {
          ...profile,
          total_orders,
          total_spent,
          last_order_date
        }
      }))
      
      setCustomers(enhancedCustomers)
      setFilteredCustomers(enhancedCustomers)
      setTotalCustomers(enhancedCustomers.length)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('customers')}</h1>
        <button
          onClick={() => {/* Export customers functionality */}}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
        >
          <span className="mr-2">📊</span>
          {t('export')}
        </button>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg"
          placeholder={t('search_customers')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Customers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('full_name')} className="flex items-center">
                  {t('name')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('email')} className="flex items-center">
                  {t('email')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('phone')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('created_at')} className="flex items-center">
                  {t('registered')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('total_orders')} className="flex items-center">
                  {t('orders')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('total_spent')} className="flex items-center">
                  {t('total_spent')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('last_order_date')} className="flex items-center">
                  {t('last_order')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.total_orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(customer.total_spent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.last_order_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link 
                      href={`/admin/customers/${customer.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Eye className="w-5 h-5 inline" />
                    </Link>
                    <a 
                      href={`mailto:${customer.email}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Mail className="w-5 h-5 inline" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('no_customers_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            {t('showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to')}{' '}
            <span className="font-medium">
              {indexOfLastItem > filteredCustomers.length ? filteredCustomers.length : indexOfLastItem}
            </span>{' '}
            {t('of')} <span className="font-medium">{filteredCustomers.length}</span> {t('results')}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 