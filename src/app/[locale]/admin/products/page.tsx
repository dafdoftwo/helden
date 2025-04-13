"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { FiPlus, FiEdit2, FiEye, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  main_image: string;
  created_at: string;
  category: {
    id: number;
    name: string;
  };
  subcategory: {
    id: number;
    name: string;
  } | null;
}

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Load user data
  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/products`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch categories for filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch products with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            price,
            discount_price,
            stock,
            is_active,
            main_image,
            created_at,
            category:categories(id, name),
            subcategory:subcategories(id, name)
          `)
          .order('created_at', { ascending: false });
        
        // Apply filters if set
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        // Get count for pagination
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        if (count !== null) {
          setTotalPages(Math.ceil(count / rowsPerPage));
        }
        
        // Apply pagination
        const from = (currentPage - 1) * rowsPerPage;
        const to = from + rowsPerPage - 1;
        query = query.range(from, to);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          setProducts(data as unknown as Product[]);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProducts();
    }
  }, [user, searchQuery, selectedCategory, currentPage, rowsPerPage]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const confirmDelete = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);
        
      if (error) throw error;
      
      // Remove from local state
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productToDelete)
      );
      
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message);
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
    return null; // Will be redirected in useEffect
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('admin.products.title')}</h1>
          
          <Link
            href={`/${language}/admin/products/add`}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            <FiPlus className="mr-2" />
            {t('admin.products.addNew')}
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
            <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('admin.products.search')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {t('common.search')}
              </button>
            </form>
            
            <div className="flex items-center">
              <FiFilter className="mr-2 text-gray-600" />
              <select
                value={selectedCategory === null ? '' : selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value ? Number(e.target.value) : null)}
                className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">{t('admin.products.allCategories')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('admin.products.noProductsFound')}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.product')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.category')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.price')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.stock')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.status')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                width={40}
                                height={40}
                                src={product.main_image}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category?.name}
                          {product.subcategory && (
                            <span className="ml-1 text-xs text-gray-400">
                              / {product.subcategory.name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.discount_price ? (
                            <div>
                              <span className="font-medium text-helden-purple">{product.discount_price}</span>
                              <span className="ml-2 line-through text-gray-400">{product.price}</span>
                            </div>
                          ) : (
                            product.price
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`${product.stock <= 5 ? 'text-red-500' : 'text-green-500'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.is_active 
                              ? t('admin.products.active') 
                              : t('admin.products.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/${language}/products/${product.slug}`}
                            className="text-gray-500 hover:text-gray-700 mr-3"
                            target="_blank"
                          >
                            <FiEye className="inline" />
                          </Link>
                          <Link
                            href={`/${language}/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <FiEdit2 className="inline" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  {t('admin.products.showing')} {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, (totalPages * rowsPerPage))} {t('admin.products.of')} {totalPages * rowsPerPage}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t('common.previous')}
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t('common.next')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">{t('admin.products.confirmDelete')}</h3>
            <p className="text-gray-500 mb-6">{t('admin.products.deleteWarning')}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 