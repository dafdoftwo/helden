"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  FiSave,
  FiX,
  FiUpload,
  FiPlus,
  FiMinus,
  FiCamera,
  FiTrash2
} from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  category_id: number;
  subcategory_id: number | null;
  main_image: string;
  additional_images: string[] | null;
  colors: string[] | null;
  sizes: string[] | null;
  is_new: boolean;
  is_featured: boolean;
  sku: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  const productId = params.id;
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    stock: '0',
    is_active: true,
    category_id: '',
    subcategory_id: '',
    main_image: '',
    colors: [''],
    sizes: [''],
    is_new: false,
    is_featured: false,
    sku: '',
    seo_title: '',
    seo_description: ''
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Load user data and check admin permission
  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin role
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        router.push(`/${language}`);
      }
    } else if (!authLoading && !user) {
      router.push(`/${language}/auth/login?returnUrl=/${language}/admin/products/edit/${productId}`);
    }
  }, [user, authLoading, router, language, productId]);
  
  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const product = data as ProductData;
          
          setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            price: product.price.toString(),
            discount_price: product.discount_price ? product.discount_price.toString() : '',
            stock: product.stock.toString(),
            is_active: product.is_active,
            category_id: product.category_id.toString(),
            subcategory_id: product.subcategory_id ? product.subcategory_id.toString() : '',
            main_image: product.main_image,
            colors: product.colors && product.colors.length > 0 ? product.colors : [''],
            sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [''],
            is_new: product.is_new,
            is_featured: product.is_featured,
            sku: product.sku || '',
            seo_title: product.seo_title || '',
            seo_description: product.seo_description || ''
          });
          
          setExistingMainImage(product.main_image);
          setMainImagePreview(product.main_image);
          
          if (product.additional_images && product.additional_images.length > 0) {
            setExistingAdditionalImages(product.additional_images);
          }
        }
      } catch (err: any) {
        console.error('Error fetching product data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId && user) {
      fetchProductData();
    }
  }, [productId, user]);
  
  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        if (categoriesData) {
          setCategories(categoriesData);
        }
        
        // Fetch all subcategories
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from('subcategories')
          .select('id, name, category_id')
          .eq('is_active', true)
          .order('name');
          
        if (subcategoriesError) throw subcategoriesError;
        
        if (subcategoriesData) {
          setSubcategories(subcategoriesData);
        }
      } catch (err: any) {
        console.error('Error fetching categories and subcategories:', err);
        setError(err.message);
      }
    };
    
    fetchCategoriesAndSubcategories();
  }, []);
  
  // Filter subcategories based on selected category
  useEffect(() => {
    if (formData.category_id) {
      const filtered = subcategories.filter(
        subcategory => subcategory.category_id === Number(formData.category_id)
      );
      setFilteredSubcategories(filtered);
      
      // Reset subcategory if the selected one is not in the filtered list
      if (
        formData.subcategory_id &&
        !filtered.find(item => item.id === Number(formData.subcategory_id))
      ) {
        setFormData(prev => ({ ...prev, subcategory_id: '' }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
    }
  }, [formData.category_id, subcategories]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear existing image reference since we're replacing it
      setExistingMainImage(null);
    }
  };
  
  const handleAdditionalImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAdditionalImageFiles(prev => [...prev, file]);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAdditionalImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingAdditionalImage = (index: number) => {
    setExistingAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const addColorField = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, '']
    }));
  };
  
  const removeColorField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };
  
  const handleColorChange = (index: number, value: string) => {
    setFormData(prev => {
      const newColors = [...prev.colors];
      newColors[index] = value;
      return { ...prev, colors: newColors };
    });
  };
  
  const addSizeField = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, '']
    }));
  };
  
  const removeSizeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };
  
  const handleSizeChange = (index: number, value: string) => {
    setFormData(prev => {
      const newSizes = [...prev.sizes];
      newSizes[index] = value;
      return { ...prev, sizes: newSizes };
    });
  };
  
  const uploadImage = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category_id) {
        throw new Error(t('admin.products.errorRequiredFields'));
      }
      
      // Prepare update data
      const updateData: any = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(formData.stock),
        is_active: formData.is_active,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        colors: formData.colors.filter(color => color.trim() !== ''),
        sizes: formData.sizes.filter(size => size.trim() !== ''),
        is_new: formData.is_new,
        is_featured: formData.is_featured,
        sku: formData.sku || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null
      };
      
      // Handle main image
      if (mainImageFile) {
        // Upload new main image
        const mainImageUrl = await uploadImage(mainImageFile, 'main');
        updateData.main_image = mainImageUrl;
      } else if (existingMainImage) {
        // Keep existing main image
        updateData.main_image = existingMainImage;
      } else {
        throw new Error(t('admin.products.errorNoMainImage'));
      }
      
      // Handle additional images
      const allAdditionalImages: string[] = [...existingAdditionalImages];
      
      // Upload new additional images if any
      for (const file of additionalImageFiles) {
        const url = await uploadImage(file, 'additional');
        allAdditionalImages.push(url);
      }
      
      updateData.additional_images = allAdditionalImages.length > 0 ? allAdditionalImages : null;
      
      // Update product in database
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select();
      
      if (error) throw error;
      
      setSuccessMessage(t('admin.products.successUpdate'));
      
      // Redirect to products list after short delay
      setTimeout(() => {
        router.push(`/${language}/admin/products`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading || loading) {
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
          <h1 className="text-2xl font-bold">{t('admin.products.editProduct')}</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/${language}/admin/products`)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <FiX className="mr-2" />
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2" />
              {isSubmitting ? t('common.saving') : t('common.save')}
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
        
        <form className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">{t('admin.products.basicInfo')}</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  {t('admin.products.name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="slug">
                  {t('admin.products.slug')} *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.products.slugHelp')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  {t('admin.products.description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                    {t('admin.products.price')} *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount_price">
                    {t('admin.products.discountPrice')}
                  </label>
                  <input
                    type="number"
                    id="discount_price"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock">
                    {t('admin.products.stock')} *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sku">
                    {t('admin.products.sku')}
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category_id">
                    {t('admin.products.category')} *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">{t('admin.products.selectCategory')}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subcategory_id">
                    {t('admin.products.subcategory')}
                  </label>
                  <select
                    id="subcategory_id"
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleInputChange}
                    disabled={!formData.category_id || filteredSubcategories.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{t('admin.products.selectSubcategory')}</option>
                    {filteredSubcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    {t('admin.products.isActive')}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_new"
                    name="is_new"
                    checked={formData.is_new}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="is_new" className="ml-2 block text-sm text-gray-700">
                    {t('admin.products.isNew')}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    {t('admin.products.isFeatured')}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Images & Variants */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">{t('admin.products.imagesAndVariants')}</h2>
              
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.products.mainImage')} *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {mainImagePreview ? (
                    <div className="space-y-2 text-center">
                      <div className="relative h-40 w-40 mx-auto">
                        <Image
                          src={mainImagePreview}
                          alt="Main product image preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="main-image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-helden-purple px-2"
                        >
                          <span>{t('admin.products.changeImage')}</span>
                          <input
                            id="main-image-upload"
                            name="main-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FiCamera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="main-image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-helden-purple"
                        >
                          <span>{t('admin.products.uploadMainImage')}</span>
                          <input
                            id="main-image-upload"
                            name="main-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.products.additionalImages')}
                </label>
                <div className="mt-1 flex flex-wrap gap-4">
                  {/* Existing additional images */}
                  {existingAdditionalImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-300">
                      <Image
                        src={image}
                        alt={`Additional image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingAdditionalImage(index)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {/* New additional images */}
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-300">
                      <Image
                        src={preview}
                        alt={`New additional image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="h-24 w-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <label
                      htmlFor="additional-image-upload"
                      className="cursor-pointer text-gray-500 hover:text-black flex flex-col items-center"
                    >
                      <FiPlus size={20} />
                      <span className="text-xs mt-1">{t('admin.products.addImage')}</span>
                      <input
                        id="additional-image-upload"
                        name="additional-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAdditionalImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Colors */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('admin.products.colors')}
                  </label>
                  <button
                    type="button"
                    onClick={addColorField}
                    className="text-sm text-black hover:text-helden-purple flex items-center"
                  >
                    <FiPlus size={16} className="mr-1" />
                    {t('admin.products.addColor')}
                  </button>
                </div>
                
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      placeholder={t('admin.products.colorPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => removeColorField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                      disabled={formData.colors.length <= 1}
                    >
                      <FiMinus size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Sizes */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('admin.products.sizes')}
                  </label>
                  <button
                    type="button"
                    onClick={addSizeField}
                    className="text-sm text-black hover:text-helden-purple flex items-center"
                  >
                    <FiPlus size={16} className="mr-1" />
                    {t('admin.products.addSize')}
                  </button>
                </div>
                
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      placeholder={t('admin.products.sizePlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                      disabled={formData.sizes.length <= 1}
                    >
                      <FiMinus size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* SEO Information */}
              <h2 className="text-lg font-semibold border-b pb-2 mt-6">{t('admin.products.seoInfo')}</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="seo_title">
                  {t('admin.products.seoTitle')}
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="seo_description">
                  {t('admin.products.seoDescription')}
                </label>
                <textarea
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push(`/${language}/admin/products`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 