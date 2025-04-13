"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiSave, FiX, FiImage, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

interface ProductFormProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { id } = params;
  const isNew = id === 'new';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    sku: '',
    images: [] as string[],
    is_featured: false,
    is_active: true,
  });
  
  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name');
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // If editing existing product, fetch product data
        if (!isNew) {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
          
          if (productError) throw productError;
          
          if (product) {
            setFormData({
              name: product.name || '',
              description: product.description || '',
              price: product.price?.toString() || '',
              stock: product.stock?.toString() || '',
              category_id: product.category_id?.toString() || '',
              sku: product.sku || '',
              images: product.images || [],
              is_featured: product.is_featured || false,
              is_active: product.is_active !== false, // Default to true if undefined
            });
          }
        }
      } catch (error: any) {
        console.error('Error loading data:', error.message);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [supabase, id, isNew]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  const uploadImages = async () => {
    if (files.length === 0) return [];
    
    setUploading(true);
    setUploadProgress(0);
    
    const uploadedUrls: string[] = [];
    const totalFiles = files.length;
    
    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        if (urlData) {
          uploadedUrls.push(urlData.publicUrl);
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload images. Please try again.');
      return [];
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.category_id) {
        throw new Error('Please fill in all required fields');
      }
      
      // Upload images if any
      const uploadedImageUrls = await uploadImages();
      const allImages = [...formData.images, ...uploadedImageUrls];
      
      // Prepare data for Supabase
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock || '0'),
        category_id: parseInt(formData.category_id),
        sku: formData.sku,
        images: allImages,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };
      
      if (isNew) {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
      } else {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        
        if (error) throw error;
      }
      
      // Redirect back to products list
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving product:', error);
      setError(error.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNew ? 'Create a new product' : `Editing product ID: ${id}`}
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/admin/products"
            className="btn-secondary flex items-center"
          >
            <FiX className="mr-2" />
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            <FiSave className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (SAR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                  Featured Product
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
        
        {/* Images Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          
          {/* Current Images */}
          {formData.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                      <img src={image} alt={`Product ${index}`} className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-100 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Images
            </label>
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            {/* Selected Files Preview */}
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload preview ${index}`}
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-2 right-2 bg-red-100 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 