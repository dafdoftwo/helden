"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { supabase, getCurrentUser } from '@/lib/supabase';

// Admin components
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ProductNewPageProps {
  params: {
    locale: string;
  };
}

export default function ProductNewPage({ params }: ProductNewPageProps) {
  const { t, language, dir } = useTranslation();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    sku: '',
    inventory: '',
    active: true,
    featured: false,
    new: true,
    sizes: [] as string[],
    colors: [] as string[]
  });
  
  // Available sizes and colors
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Purple', value: '#800080' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'Gray', value: '#808080' },
    { name: 'Brown', value: '#A52A2A' }
  ];
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push(`/${params.locale}/auth/login`);
          return;
        }
        
        // Check if user has admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
          
        if (!profile || profile.role !== 'admin') {
          // Not an admin, redirect to homepage
          router.push(`/${params.locale}`);
          return;
        }
        
        // Load categories
        fetchCategories();
      } catch (error) {
        console.error('Error checking admin auth:', error);
      }
    };
    
    checkAdminAuth();
  }, [params.locale, router]);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };
  
  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...fileArray]);
      
      // Create preview URLs
      const urlArray = fileArray.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urlArray]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${productId}-${Date.now()}-${i}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      if (publicUrlData.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }
    
    return uploadedUrls;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setSubmitting(true);
      
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category_id) {
        setError(t('admin.products.formValidationError'));
        setSubmitting(false);
        return;
      }
      
      // Create the product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          category_id: formData.category_id,
          sku: formData.sku || null,
          active: formData.active,
          featured: formData.featured,
          new: formData.new,
          sizes: selectedSizes,
          colors: selectedColors,
          images: [] // Will update after upload
        })
        .select()
        .single();
      
      if (productError) {
        throw productError;
      }
      
      // Upload images
      if (images.length > 0 && productData) {
        const uploadedUrls = await uploadImages(productData.id);
        
        // Update product with image URLs
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: uploadedUrls })
          .eq('id', productData.id);
        
        if (updateError) {
          console.error('Error updating product with images:', updateError);
        }
      }
      
      // Create inventory record
      if (formData.inventory && productData) {
        const { error: inventoryError } = await supabase
          .from('inventory')
          .insert({
            product_id: productData.id,
            quantity: parseInt(formData.inventory),
            sizes_inventory: selectedSizes.reduce((acc, size) => {
              acc[size] = Math.floor(parseInt(formData.inventory) / selectedSizes.length);
              return acc;
            }, {} as Record<string, number>)
          });
        
        if (inventoryError) {
          console.error('Error creating inventory:', inventoryError);
        }
      }
      
      // Redirect to products page
      router.push(`/${params.locale}/admin/products`);
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      setError(error.message || t('admin.products.createError'));
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100" dir={dir}>
      <div className="flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <AdminSidebar activePage="products" locale={params.locale} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('admin.products.addProduct')}</h1>
              
              <button
                onClick={() => router.push(`/${params.locale}/admin/products`)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple"
              >
                {t('admin.products.backToProducts')}
              </button>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ms-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4">{t('admin.products.basicInfo')}</h2>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-helden-purple focus:border-helden-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.description')}
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-helden-purple focus:border-helden-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.price')} *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">SAR</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="focus:ring-helden-purple focus:border-helden-purple block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.originalPrice')}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">SAR</span>
                      </div>
                      <input
                        type="number"
                        name="original_price"
                        id="original_price"
                        min="0"
                        step="0.01"
                        value={formData.original_price}
                        onChange={handleInputChange}
                        className="focus:ring-helden-purple focus:border-helden-purple block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{t('admin.products.originalPriceHint')}</p>
                  </div>
                  
                  <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.category')} *
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      required
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-helden-purple focus:border-helden-purple sm:text-sm"
                    >
                      <option value="">{t('admin.products.selectCategory')}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.sku')}
                    </label>
                    <input
                      type="text"
                      name="sku"
                      id="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-helden-purple focus:border-helden-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">{t('admin.products.skuHint')}</p>
                  </div>
                  
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                      {t('admin.products.inventory')}
                    </label>
                    <input
                      type="number"
                      name="inventory"
                      id="inventory"
                      min="0"
                      value={formData.inventory}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-helden-purple focus:border-helden-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                {/* Product Attributes */}
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4 pt-4">{t('admin.products.attributes')}</h2>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        id="active"
                        name="active"
                        type="checkbox"
                        checked={formData.active}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ms-2 block text-sm text-gray-700">
                        {t('admin.products.active')}
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ms-2 block text-sm text-gray-700">
                        {t('admin.products.featured')}
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="new"
                        name="new"
                        type="checkbox"
                        checked={formData.new}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                      />
                      <label htmlFor="new" className="ms-2 block text-sm text-gray-700">
                        {t('admin.products.newLabel')}
                      </label>
                    </div>
                  </div>
                  
                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.sizes')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                            selectedSizes.includes(size)
                              ? 'bg-helden-purple text-white border-helden-purple'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.colors')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleColorToggle(color.name)}
                          className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                            selectedColors.includes(color.name)
                              ? 'bg-gray-100 text-gray-800 border-gray-300'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full me-2 border border-gray-300" 
                            style={{ backgroundColor: color.value }}
                          ></span>
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Product Images */}
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4 pt-4">{t('admin.products.images')}</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.products.uploadImages')}
                  </label>
                  
                  <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-helden-purple hover:text-helden-purple-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-helden-purple"
                        >
                          <span>{t('admin.products.uploadFile')}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">{t('admin.products.dragAndDrop')}</p>
                      </div>
                      <p className="text-xs text-gray-500">{t('admin.products.imageHint')}</p>
                    </div>
                  </div>
                  
                  {/* Image Previews */}
                  {imageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden h-32">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 focus:outline-none"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => router.push(`/${params.locale}/admin/products`)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple me-3"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-helden-purple hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('admin.saving')}
                    </>
                  ) : (
                    t('admin.save')
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 