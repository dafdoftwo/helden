'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Edit, Trash2, Plus } from 'lucide-react'

interface ShippingOption {
  id: number
  name: string
  provider: string
  price: number
  estimated_days: number
  tracking_url_template: string
  active: boolean
  created_at: string
  updated_at: string
}

interface ShippingPageProps {
  params: {
    locale: string
  }
}

export default function ShippingManagement({ params }: ShippingPageProps) {
  const t = useTranslations('Admin')
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState<ShippingOption | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    price: 0,
    estimated_days: 1,
    tracking_url_template: '',
    active: true
  })

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
    fetchShippingOptions()
  }, [params.locale, router])
  
  // Filter shipping options based on search
  useEffect(() => {
    let result = shippingOptions
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(option => 
        option.name.toLowerCase().includes(search) ||
        option.provider.toLowerCase().includes(search)
      )
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      const fieldA = a[sortField as keyof ShippingOption]
      const fieldB = b[sortField as keyof ShippingOption]
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA)
      } else {
        return sortDirection === 'asc' 
          ? Number(fieldA) - Number(fieldB) 
          : Number(fieldB) - Number(fieldA)
      }
    })
    
    setFilteredOptions(result)
  }, [searchTerm, shippingOptions, sortField, sortDirection])

  const fetchShippingOptions = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('shipping_options')
        .select('*')
      
      if (error) throw error
      
      setShippingOptions(data)
      setFilteredOptions(data)
    } catch (error) {
      console.error('Error fetching shipping options:', error)
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
  const currentOptions = filteredOptions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage)
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
  }
  
  // Open edit modal
  const openEditModal = (option: ShippingOption | null = null) => {
    setCurrentOption(option)
    
    if (option) {
      setFormData({
        name: option.name,
        provider: option.provider,
        price: option.price,
        estimated_days: option.estimated_days,
        tracking_url_template: option.tracking_url_template,
        active: option.active
      })
    } else {
      // Reset form for new option
      setFormData({
        name: '',
        provider: '',
        price: 0,
        estimated_days: 1,
        tracking_url_template: '',
        active: true
      })
    }
    
    setEditModalOpen(true)
  }
  
  // Open delete modal
  const openDeleteModal = (option: ShippingOption) => {
    setCurrentOption(option)
    setDeleteModalOpen(true)
  }
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    })
  }
  
  // Save shipping option
  const saveShippingOption = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (currentOption) {
        // Update existing option
        const { error } = await supabase
          .from('shipping_options')
          .update(formData)
          .eq('id', currentOption.id)
        
        if (error) throw error
      } else {
        // Create new option
        const { error } = await supabase
          .from('shipping_options')
          .insert(formData)
        
        if (error) throw error
      }
      
      // Refresh data
      fetchShippingOptions()
      setEditModalOpen(false)
    } catch (error) {
      console.error('Error saving shipping option:', error)
    }
  }
  
  // Delete shipping option
  const deleteShippingOption = async () => {
    if (!currentOption) return
    
    try {
      const { error } = await supabase
        .from('shipping_options')
        .delete()
        .eq('id', currentOption.id)
      
      if (error) throw error
      
      // Refresh data
      fetchShippingOptions()
      setDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting shipping option:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('shipping_management')}</h1>
        <button
          onClick={() => openEditModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('add_shipping_option')}
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
          placeholder={t('search_shipping_options')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Shipping Options Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('name')} className="flex items-center">
                  {t('name')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('provider')} className="flex items-center">
                  {t('provider')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('price')} className="flex items-center">
                  {t('price')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('estimated_days')} className="flex items-center">
                  {t('delivery_time')}
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort('active')} className="flex items-center">
                  {t('status')}
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
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : currentOptions.length > 0 ? (
              currentOptions.map((option) => (
                <tr key={option.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {option.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(option.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.estimated_days} {t('days')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      option.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {option.active ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => openEditModal(option)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(option)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('no_shipping_options_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && filteredOptions.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            {t('showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to')}{' '}
            <span className="font-medium">
              {indexOfLastItem > filteredOptions.length ? filteredOptions.length : indexOfLastItem}
            </span>{' '}
            {t('of')} <span className="font-medium">{filteredOptions.length}</span> {t('results')}
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
      
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {currentOption ? t('edit_shipping_option') : t('add_shipping_option')}
              </h3>
              <form onSubmit={saveShippingOption}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('provider')}</label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('price')} (SAR)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('estimated_days')}</label>
                    <input
                      type="number"
                      name="estimated_days"
                      value={formData.estimated_days}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('tracking_url')}</label>
                    <input
                      type="text"
                      name="tracking_url_template"
                      value={formData.tracking_url_template}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="https://example.com/track/{tracking_number}"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="mr-2"
                      id="active-checkbox"
                    />
                    <label htmlFor="active-checkbox" className="text-sm font-medium">
                      {t('active')}
                    </label>
                  </div>
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && currentOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">{t('confirm_delete')}</h3>
              <p className="mb-4">
                {t('delete_shipping_option_confirm', { name: currentOption.name })}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={deleteShippingOption}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 