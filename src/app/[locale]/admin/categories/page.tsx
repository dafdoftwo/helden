"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye
} from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  subcategories_count: number;
  products_count: number;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  category_id: number;
  category: {
    name: string;
  };
  created_at: string;
  products_count: number;
}

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, type: 'category' | 'subcategory'} | null>(null);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/categories`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch categories data with counts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Calculate pagination
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Get total count first for pagination
        const { count: totalCount, error: countError } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true })
          .ilike('name', `%${searchQuery}%`);
          
        if (countError) throw countError;
        
        // Set total pages
        if (totalCount !== null) {
          setTotalPages(Math.ceil(totalCount / itemsPerPage));
        }
        
        // Fetch categories with counts
        const { data, error } = await supabase
          .from('categories')
          .select(`
            id, 
            name, 
            slug, 
            description, 
            is_active, 
            created_at,
            subcategories!categories_id_fkey(count),
            products!category_id_fkey(count)
          `)
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .range(from, to);
          
        if (error) throw error;
        
        // Transform data to include counts
        const categoriesWithCounts = data.map(category => ({
          ...category,
          subcategories_count: category.subcategories[0]?.count || 0,
          products_count: category.products[0]?.count || 0
        }));
        
        setCategories(categoriesWithCounts);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && activeTab === 'categories') {
      fetchCategories();
    }
  }, [user, page, itemsPerPage, searchQuery, activeTab]);
  
  // Fetch subcategories data with counts
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        
        // Calculate pagination
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Get total count first for pagination
        const { count: totalCount, error: countError } = await supabase
          .from('subcategories')
          .select('*', { count: 'exact', head: true })
          .ilike('name', `%${searchQuery}%`);
          
        if (countError) throw countError;
        
        // Set total pages
        if (totalCount !== null) {
          setTotalPages(Math.ceil(totalCount / itemsPerPage));
        }
        
        // Fetch subcategories with counts
        const { data, error } = await supabase
          .from('subcategories')
          .select(`
            id, 
            name, 
            slug, 
            description, 
            is_active, 
            category_id, 
            categories!categories_id_fkey (name),
            created_at,
            products!subcategory_id_fkey(count)
          `)
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .range(from, to);
          
        if (error) throw error;
        
        // Transform data to include counts and category name
        const subcategoriesWithData = data.map(subcategory => ({
          ...subcategory,
          category: {
            name: subcategory.categories?.name || ''
          },
          products_count: subcategory.products && subcategory.products[0] ? subcategory.products[0].count : 0
        }));
        
        setSubcategories(subcategoriesWithData);
      } catch (err: any) {
        console.error('Error fetching subcategories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && activeTab === 'subcategories') {
      fetchSubcategories();
    }
  }, [user, page, itemsPerPage, searchQuery, activeTab]);
  
  // Handle tab change
  const handleTabChange = (tab: 'categories' | 'subcategories') => {
    setActiveTab(tab);
    setPage(1);
    setSearchQuery('');
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  
  // Open delete confirmation modal
  const openDeleteModal = (id: number, type: 'category' | 'subcategory') => {
    setItemToDelete({ id, type });
    setDeleteModalOpen(true);
  };
  
  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      setLoading(true);
      
      if (itemToDelete.type === 'category') {
        // Check if category has subcategories
        const { count, error: countError } = await supabase
          .from('subcategories')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', itemToDelete.id);
          
        if (countError) throw countError;
        
        if (count && count > 0) {
          throw new Error(t('admin.categories.errorHasSubcategories'));
        }
        
        // Check if category has products
        const { count: productCount, error: productCountError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', itemToDelete.id);
          
        if (productCountError) throw productCountError;
        
        if (productCount && productCount > 0) {
          throw new Error(t('admin.categories.errorHasProducts'));
        }
        
        // Delete category
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        
        // Update local state
        setCategories(prev => prev.filter(category => category.id !== itemToDelete.id));
      } else {
        // Check if subcategory has products
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('subcategory_id', itemToDelete.id);
          
        if (countError) throw countError;
        
        if (count && count > 0) {
          throw new Error(t('admin.categories.errorHasProducts'));
        }
        
        // Delete subcategory
        const { error } = await supabase
          .from('subcategories')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        
        // Update local state
        setSubcategories(prev => prev.filter(subcategory => subcategory.id !== itemToDelete.id));
      }
      
      // Close modal
      closeDeleteModal();
    } catch (err: any) {
      console.error('Error deleting item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold">{t('admin.categories.title')}</h1>
          
          <div className="flex space-x-2">
            <Link
              href={`/${language}/admin/categories/${activeTab === 'categories' ? 'add' : 'subcategories/add'}`}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <FiPlus className="mr-2" />
              {activeTab === 'categories' 
                ? t('admin.categories.addCategory') 
                : t('admin.categories.addSubcategory')}
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'categories'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('categories')}
            >
              {t('admin.categories.categoriesTab')}
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'subcategories'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('subcategories')}
            >
              {t('admin.categories.subcategoriesTab')}
            </button>
          </div>
          
          {/* Search bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder={t('admin.common.search')}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* Categories list */}
          {activeTab === 'categories' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.slug')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.subcategories')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.products')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('admin.common.loading')}
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery
                          ? t('admin.categories.noSearchResults')
                          : t('admin.categories.noCategories')}
                      </td>
                    </tr>
                  ) : (
                    categories.map(category => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              category.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.is_active
                              ? t('admin.common.active')
                              : t('admin.common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.subcategories_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.products_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/${language}/admin/categories/edit/${category.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FiEdit size={18} />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(category.id, 'category')}
                              className="text-red-600 hover:text-red-900"
                              disabled={category.products_count > 0 || category.subcategories_count > 0}
                              title={
                                category.products_count > 0 || category.subcategories_count > 0
                                  ? t('admin.categories.cannotDelete')
                                  : t('admin.common.delete')
                              }
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Subcategories list */}
          {activeTab === 'subcategories' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.parentCategory')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.slug')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.categories.products')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('admin.common.loading')}
                      </td>
                    </tr>
                  ) : subcategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery
                          ? t('admin.categories.noSearchResults')
                          : t('admin.categories.noSubcategories')}
                      </td>
                    </tr>
                  ) : (
                    subcategories.map(subcategory => (
                      <tr key={subcategory.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subcategory.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subcategory.category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subcategory.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subcategory.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {subcategory.is_active
                              ? t('admin.common.active')
                              : t('admin.common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subcategory.products_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/${language}/admin/categories/subcategories/edit/${subcategory.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FiEdit size={18} />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(subcategory.id, 'subcategory')}
                              className="text-red-600 hover:text-red-900"
                              disabled={subcategory.products_count > 0}
                              title={
                                subcategory.products_count > 0
                                  ? t('admin.categories.cannotDelete')
                                  : t('admin.common.delete')
                              }
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
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
      
      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('admin.common.confirmDelete')}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {itemToDelete?.type === 'category'
                ? t('admin.categories.confirmDeleteCategory')
                : t('admin.categories.confirmDeleteSubcategory')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('admin.common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 