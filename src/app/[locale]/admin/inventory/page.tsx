"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiPlus, 
  FiAlertCircle, 
  FiArrowUp, 
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiX
} from 'react-icons/fi';

interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  min_stock_threshold: number | null;
  category: {
    name: string;
  };
  last_updated: string;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  quantity_change: number;
  reason: string;
  created_by: string;
  created_at: string;
}

export default function InventoryManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortColumn, setSortColumn] = useState<'name' | 'stock' | 'category' | 'last_updated'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showStockMovements, setShowStockMovements] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;
  
  // Update stock modal
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [stockUpdateData, setStockUpdateData] = useState({
    product_id: 0,
    product_name: '',
    quantity: '',
    reason: '',
    adjust_type: 'add' as 'add' | 'subtract' | 'set'
  });
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/inventory`);
    }
  }, [user, authLoading, router, language]);
  
  // Fetch products data
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, currentPage, stockFilter, sortColumn, sortDirection]);
  
  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const delaySearch = setTimeout(() => {
        fetchProducts();
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm]);
  
  // Fetch stock movements when selecting a product
  useEffect(() => {
    if (selectedProductId && showStockMovements) {
      fetchStockMovements(selectedProductId);
    }
  }, [selectedProductId, showStockMovements]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Start with base query
      let query = supabase
        .from('products')
        .select(`
          id, 
          name, 
          sku, 
          stock, 
          min_stock_threshold,
          category:categories (name),
          last_updated:updated_at
        `);
      
      // Add stock filter
      if (stockFilter !== 'all') {
        if (stockFilter === 'in_stock') {
          query = query.gt('stock', 0);
        } else if (stockFilter === 'low_stock') {
          query = query.gt('stock', 0)
                       .lt('stock', 10) // Default threshold, will be refined below
                       .not('min_stock_threshold', 'is', null);
        } else if (stockFilter === 'out_of_stock') {
          query = query.eq('stock', 0);
        }
      }
      
      // Add search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
      }
      
      // Get total count for pagination
      const countResponse = await query.count();
      const count = countResponse.count ?? 0;
      
      setTotalProducts(count);
      setTotalPages(Math.ceil(count / itemsPerPage));
      
      // Add sorting and pagination
      if (sortColumn === 'category') {
        query = query.order('category(name)', { ascending: sortDirection === 'asc' });
      } else {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      }
      
      query = query.range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process data to add stock_status
      if (data) {
        const processedData = data.map(item => {
          let stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
          
          if (item.stock <= 0) {
            stock_status = 'out_of_stock';
          } else if (
            item.min_stock_threshold !== null && 
            item.stock <= item.min_stock_threshold
          ) {
            stock_status = 'low_stock';
          } else {
            stock_status = 'in_stock';
          }
          
          // Fix category format to match the Product interface
          return {
            ...item,
            category: Array.isArray(item.category) ? item.category[0] : item.category,
            stock_status
          } as unknown as Product;
        });
        
        setProducts(processedData);
      }
      
    } catch (err: any) {
      console.error('Error fetching inventory data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStockMovements = async (productId: number) => {
    try {
      setMovementsLoading(true);
      
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          id,
          product_id,
          product_name:products(name),
          quantity_change,
          reason,
          created_by,
          created_at
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (data) {
        // Transform data to match the StockMovement interface
        const processedData = data.map(item => ({
          ...item,
          product_name: Array.isArray(item.product_name) ? item.product_name[0]?.name : item.product_name
        })) as unknown as StockMovement[];
        
        setStockMovements(processedData);
      }
      
    } catch (err: any) {
      console.error('Error fetching stock movements:', err);
    } finally {
      setMovementsLoading(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleStockFilterChange = (status: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock') => {
    setStockFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleSort = (column: 'name' | 'stock' | 'category' | 'last_updated') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const openUpdateStockModal = (product: Product) => {
    setStockUpdateData({
      product_id: product.id,
      product_name: product.name,
      quantity: '',
      reason: '',
      adjust_type: 'add'
    });
    setShowUpdateStockModal(true);
  };
  
  const closeUpdateStockModal = () => {
    setShowUpdateStockModal(false);
  };
  
  const handleUpdateStockInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      // Only allow positive integers for quantity
      if (/^\d*$/.test(value)) {
        setStockUpdateData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setStockUpdateData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stockUpdateData.quantity || !stockUpdateData.reason) {
      alert(t('admin.inventory.fillAllFields'));
      return;
    }
    
    try {
      // Get current stock level
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', stockUpdateData.product_id)
        .single();
      
      if (productError) throw productError;
      
      // Calculate new stock level
      let newStock = 0;
      const quantityVal = parseInt(stockUpdateData.quantity);
      
      switch (stockUpdateData.adjust_type) {
        case 'add':
          newStock = productData.stock + quantityVal;
          break;
        case 'subtract':
          newStock = Math.max(0, productData.stock - quantityVal);
          break;
        case 'set':
          newStock = quantityVal;
          break;
      }
      
      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', stockUpdateData.product_id);
      
      if (updateError) throw updateError;
      
      // Record stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: stockUpdateData.product_id,
          quantity_change: stockUpdateData.adjust_type === 'subtract' 
            ? -quantityVal 
            : (stockUpdateData.adjust_type === 'set' 
              ? newStock - productData.stock 
              : quantityVal),
          reason: stockUpdateData.reason,
          created_by: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || user?.email || 'Admin',
        });
      
      if (movementError) throw movementError;
      
      // Close modal and refresh data
      closeUpdateStockModal();
      fetchProducts();
      
      // Refresh stock movements if viewing them
      if (selectedProductId === stockUpdateData.product_id && showStockMovements) {
        fetchStockMovements(selectedProductId);
      }
      
    } catch (err: any) {
      console.error('Error updating stock:', err);
      alert(t('admin.inventory.updateError'));
    }
  };
  
  const viewStockMovements = (productId: number) => {
    setSelectedProductId(productId);
    setShowStockMovements(true);
  };
  
  const closeStockMovements = () => {
    setShowStockMovements(false);
    setSelectedProductId(null);
    setStockMovements([]);
  };
  
  const exportInventoryCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "SKU,Product Name,Stock Level,Category,Status\n";
    
    // Add rows
    products.forEach(product => {
      const status = product.stock_status === 'in_stock' 
        ? 'In Stock' 
        : product.stock_status === 'low_stock' 
          ? 'Low Stock' 
          : 'Out of Stock';
          
      csvContent += `${product.sku || ''},${product.name},${product.stock},"${product.category.name}",${status}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Download file
    link.click();
    document.body.removeChild(link);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div>
            <h1 className="text-2xl font-bold">{t('admin.inventory.title')}</h1>
            <p className="text-gray-600">{t('admin.inventory.subtitle')}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={exportInventoryCSV}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <FiDownload className="mr-2" />
              {t('admin.inventory.export')}
            </button>
            <Link
              href={`/${language}/admin/products/add`}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <FiPlus className="mr-2" />
              {t('admin.products.addProduct')}
            </Link>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('admin.inventory.searchPlaceholder')}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div className="inline-flex shadow-sm rounded-md">
            <button
              onClick={() => handleStockFilterChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                stockFilter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              {t('admin.inventory.allItems')}
            </button>
            <button
              onClick={() => handleStockFilterChange('in_stock')}
              className={`px-4 py-2 text-sm font-medium ${
                stockFilter === 'in_stock'
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              {t('admin.inventory.inStock')}
            </button>
            <button
              onClick={() => handleStockFilterChange('low_stock')}
              className={`px-4 py-2 text-sm font-medium ${
                stockFilter === 'low_stock'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              {t('admin.inventory.lowStock')}
            </button>
            <button
              onClick={() => handleStockFilterChange('out_of_stock')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                stockFilter === 'out_of_stock'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              {t('admin.inventory.outOfStock')}
            </button>
          </div>
        </div>
        
        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      {t('admin.inventory.product')}
                      {sortColumn === 'name' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      {t('admin.inventory.stock')}
                      {sortColumn === 'stock' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      {t('admin.inventory.category')}
                      {sortColumn === 'category' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.inventory.status')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('last_updated')}
                  >
                    <div className="flex items-center">
                      {t('admin.inventory.lastUpdated')}
                      {sortColumn === 'last_updated' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.common.actions')}
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
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {t('admin.inventory.noProducts')}
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            SKU: {product.sku || t('admin.inventory.noSku')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock_status === 'in_stock'
                              ? 'bg-green-100 text-green-800'
                              : product.stock_status === 'low_stock'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.stock_status === 'in_stock'
                            ? t('admin.inventory.statusInStock')
                            : product.stock_status === 'low_stock'
                              ? t('admin.inventory.statusLowStock')
                              : t('admin.inventory.statusOutOfStock')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.last_updated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => viewStockMovements(product.id)}
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                            title={t('admin.inventory.viewHistory')}
                          >
                            <FiRefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => openUpdateStockModal(product)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100"
                            title={t('admin.inventory.updateStock')}
                          >
                            <FiEdit size={16} />
                          </button>
                          <Link
                            href={`/${language}/admin/products/edit/${product.id}`}
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                            title={t('admin.products.editProduct')}
                          >
                            <FiPlus size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('admin.common.showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                {t('admin.common.to')}{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalProducts)}
                </span>{' '}
                {t('admin.common.of')} <span className="font-medium">{totalProducts}</span>{' '}
                {t('admin.inventory.items')}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stock Movements Modal */}
      {showStockMovements && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('admin.inventory.stockMovementHistory')}
              </h3>
              <button
                onClick={closeStockMovements}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            {movementsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-black"></div>
              </div>
            ) : stockMovements.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                {t('admin.inventory.noMovements')}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.inventory.date')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.inventory.quantityChange')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.inventory.reason')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.inventory.updatedBy')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.map(movement => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(movement.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`text-sm font-medium ${
                              movement.quantity_change > 0 
                                ? 'text-green-700' 
                                : movement.quantity_change < 0 
                                  ? 'text-red-700' 
                                  : 'text-gray-700'
                            }`}
                          >
                            {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-sm truncate">
                          {movement.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {movement.created_by}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Update Stock Modal */}
      {showUpdateStockModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('admin.inventory.updateStock')}
              </h3>
              <button
                onClick={closeUpdateStockModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStock}>
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">{t('admin.inventory.product')}:</p>
                <p className="font-medium">{stockUpdateData.product_name}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adjust_type">
                  {t('admin.inventory.adjustmentType')}
                </label>
                <select
                  id="adjust_type"
                  name="adjust_type"
                  value={stockUpdateData.adjust_type}
                  onChange={handleUpdateStockInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="add">{t('admin.inventory.addStock')}</option>
                  <option value="subtract">{t('admin.inventory.subtractStock')}</option>
                  <option value="set">{t('admin.inventory.setStock')}</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                  {t('admin.inventory.quantity')} *
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={stockUpdateData.quantity}
                  onChange={handleUpdateStockInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reason">
                  {t('admin.inventory.reason')} *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={stockUpdateData.reason}
                  onChange={handleUpdateStockInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeUpdateStockModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  {t('admin.common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {t('admin.inventory.updateStock')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 