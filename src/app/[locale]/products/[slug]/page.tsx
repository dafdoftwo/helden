"use client";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiHeart, FiShoppingBag, FiShare2, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { TbAugmentedReality, TbView360 } from 'react-icons/tb';
import { useTranslation } from '@/i18n';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductGallery from '@/components/products/ProductGallery';
// Dynamic imports to reduce initial load time
const ProductARView = lazy(() => import('@/components/products/ProductARView'));
const Product360Viewer = lazy(() => import('@/components/products/Product360Viewer'));
import { useCart } from '@/hooks/useCart';
import { Breadcrumb } from '@/components/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import ProductNotFoundPage from '../product-not-found';

interface Product {
  id: number | string; // Allow either number or string to work with database and mock data
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  category_id: number;
  subcategory_id: number | null;
  slug: string;
  main_image: string;
  additional_images: string[] | null;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  colors: string[] | null;
  sizes: string[] | null;
  is_new: boolean;
  is_featured: boolean;
  is_favorite?: boolean;
  rating: string;
  reviews: number;
  discount: number | null;
}

// بيانات المنتج التجريبية
const getProduct = (id: string): Product => {
  const productId = id.split('-')[0]; // Category name: abaya, casual, etc.
  
  switch (productId) {
    case 'abaya':
      return {
        id,
        name: 'products.items.elegant_abaya.name',
        description: 'products.items.elegant_abaya.description',
        price: 1200,
        discount_price: 1020,
        stock: 10,
        is_active: true,
        category_id: 1,
        subcategory_id: null,
        slug: 'abaya-1',
        main_image: '/images/products/abaya1.jpg',
        additional_images: ['/images/products/abaya2.jpg', '/images/products/abaya3.jpg'],
        created_at: '2024-04-01',
        seo_title: 'products.items.elegant_abaya.name',
        seo_description: 'products.items.elegant_abaya.description',
        colors: ['#000000', '#392e3a', '#4a3636'],
        sizes: ['S', 'M', 'L', 'XL'],
        is_new: true,
        is_featured: true,
        is_favorite: false,
        rating: '4.8',
        reviews: 124,
        discount: 15,
      };
    case 'casual':
      return {
        id,
        name: 'products.items.casual_thobe.name',
        description: 'products.items.casual_thobe.description',
        price: 450,
        discount_price: 360,
        stock: 5,
        is_active: true,
        category_id: 2,
        subcategory_id: null,
        slug: 'casual-1',
        main_image: '/images/products/casual1.jpg',
        additional_images: ['/images/products/casual2.jpg', '/images/products/casual3.jpg'],
        created_at: '2024-04-01',
        seo_title: 'products.items.casual_thobe.name',
        seo_description: 'products.items.casual_thobe.description',
        colors: ['#f5f5dc', '#d3d3d3', '#ffb6c1'],
        sizes: ['S', 'M', 'L', 'XL'],
        is_new: true,
        is_featured: true,
        is_favorite: false,
        rating: '4.5',
        reviews: 87,
        discount: 20,
      };
    case 'formal':
      return {
        id,
        name: 'products.items.premium_thobe.name',
        description: 'products.items.premium_thobe.description',
        price: 850,
        discount_price: null,
        stock: 3,
        is_active: true,
        category_id: 3,
        subcategory_id: null,
        slug: 'formal-1',
        main_image: '/images/products/formal1.jpg',
        additional_images: ['/images/products/formal2.jpg', '/images/products/formal3.jpg'],
        created_at: '2024-04-01',
        seo_title: 'products.items.premium_thobe.name',
        seo_description: 'products.items.premium_thobe.description',
        colors: ['#800020', '#000000', '#0f0f0f'],
        sizes: ['S', 'M', 'L', 'XL'],
        is_new: true,
        is_featured: true,
        is_favorite: false,
        rating: '4.9',
        reviews: 56,
        discount: null,
      };
    case 'sports':
      return {
        id,
        name: 'products.items.modern_hijab.name',
        description: 'products.items.modern_hijab.description',
        price: 350,
        discount_price: 262.5,
        stock: 7,
        is_active: true,
        category_id: 4,
        subcategory_id: null,
        slug: 'sports-1',
        main_image: '/images/products/sports1.jpg',
        additional_images: ['/images/products/sports2.jpg', '/images/products/sports3.jpg'],
        created_at: '2024-04-01',
        seo_title: 'products.items.modern_hijab.name',
        seo_description: 'products.items.modern_hijab.description',
        colors: ['#ff69b4', '#4b0082', '#00ced1', '#000000'],
        sizes: ['S', 'M', 'L', 'XL'],
        is_new: true,
        is_featured: true,
        is_favorite: false,
        rating: '4.6',
        reviews: 93,
        discount: 25,
      };
    case 'body':
      return {
        id,
        name: 'products.items.embellished_abaya.name',
        description: 'products.items.embellished_abaya.description',
        price: 180,
        discount_price: 126,
        stock: 8,
        is_active: true,
        category_id: 5,
        subcategory_id: null,
        slug: 'body-1',
        main_image: '/images/products/abaya3.jpg',
        additional_images: ['/images/products/abaya1.jpg', '/images/products/abaya2.jpg'],
        created_at: '2024-04-01',
        seo_title: 'products.items.embellished_abaya.name',
        seo_description: 'products.items.embellished_abaya.description',
        colors: ['#f5f5dc', '#000000', '#d3d3d3'],
        sizes: ['S', 'M', 'L', 'XL'],
        is_new: true,
        is_featured: true,
        is_favorite: false,
        rating: '4.7',
        reviews: 145,
        discount: 30,
      };
    default:
      return {
        id,
        name: 'products.items.casual_bag.name',
        description: 'products.items.casual_bag.description',
        price: 500,
        discount_price: 450,
        stock: 15,
        is_active: true,
        category_id: 1,
        subcategory_id: null,
        slug: 'default-product',
        main_image: '/images/products/formal2.jpg',
        additional_images: ['/images/products/formal3.jpg', '/images/products/formal1.jpg'],
        created_at: '2024-04-01',
        seo_title: 'products.items.casual_bag.name',
        seo_description: 'products.items.casual_bag.description',
        colors: ['#000000', '#ffffff', '#ff0000'],
        sizes: ['S', 'M', 'L', 'XL'],
        is_new: true,
        is_featured: true,
        is_favorite: false,
        rating: '4.5',
        reviews: 100,
        discount: 10,
      };
  }
};

// After the Product interface, add helper functions
const getNumericId = (product: Product): number => {
  return typeof product.id === 'string' ? parseInt(product.id) : product.id;
};

const getNumericCategoryId = (product: Product): number => {
  return typeof product.category_id === 'string' ? parseInt(product.category_id) : product.category_id;
};

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const supabase = createClientComponentClient();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showARView, setShowARView] = useState(false);
  const [show360View, setShow360View] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | '360' | 'ar'>('gallery');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setCurrentUser(data.session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, [supabase]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const { data: productData, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        if (productData) {
          let productWithFavorite = { ...productData };
          
          // Check if product is in user's favorites
          if (currentUser) {
            const { data: favoriteData } = await supabase
              .from('favorites')
              .select('*')
              .eq('user_id', currentUser)
              .eq('product_id', productData.id)
              .maybeSingle();
            
            productWithFavorite.is_favorite = !!favoriteData;
          }
          
          setProduct(productWithFavorite);
          
          // Set initial color and size if available
          if (productWithFavorite.colors && productWithFavorite.colors.length > 0) {
            setSelectedColor(productWithFavorite.colors[0]);
          }
          
          if (productWithFavorite.sizes && productWithFavorite.sizes.length > 0) {
            setSelectedSize(productWithFavorite.sizes[0]);
          }
        } else {
          // Fallback to mock data if no product found in database
          const mockProduct = getProduct(slug);
          setProduct(mockProduct);
          
          // Set initial color and size
          if (mockProduct.colors && mockProduct.colors.length > 0) {
            setSelectedColor(mockProduct.colors[0]);
          }
          
          if (mockProduct.sizes && mockProduct.sizes.length > 0) {
            setSelectedSize(mockProduct.sizes[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback to mock data on error
        const mockProduct = getProduct(slug);
        setProduct(mockProduct);
        
        // Set initial color and size
        if (mockProduct.colors && mockProduct.colors.length > 0) {
          setSelectedColor(mockProduct.colors[0]);
        }
        
        if (mockProduct.sizes && mockProduct.sizes.length > 0) {
          setSelectedSize(mockProduct.sizes[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProduct();
    }
  }, [slug, supabase, currentUser]);
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && (!product || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleToggleFavorite = async () => {
    if (!product) return;
    
    if (!currentUser) {
      // Redirect to login
      window.location.href = `/${locale}/auth/login?redirect=${window.location.pathname}`;
      return;
    }
    
    try {
      if (product.is_favorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUser)
          .eq('product_id', getNumericId(product));
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({ 
            user_id: currentUser, 
            product_id: getNumericId(product) 
          });
      }
      
      // Update local state
      setProduct({
        ...product,
        is_favorite: !product.is_favorite
      });
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: getNumericId(product),
      name: product.name.startsWith('products.') ? t(product.name) : product.name,
      price: product.discount_price ? 
        (typeof product.discount_price === 'string' ? 
          Number(product.discount_price) : product.discount_price) : 
        (typeof product.price === 'string' ? 
          Number(product.price) : product.price),
      image: product.main_image,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('product.linkCopied'));
    }
  };
  
  // Get 3D model path based on product category
  const getModelPath = (product: Product | null) => {
    if (!product) return '/models/default.glb';
    
    const categoryId = getNumericCategoryId(product);
    
    switch (categoryId) {
      case 1: // Abayas
        return '/models/abaya.glb';
      case 2: // Casual
        return '/models/casual.glb';
      case 5: // Body shapers
        return '/models/bodyshaper.glb';
      default:
        return '/models/default.glb';
    }
  };
  
  // Get 360-degree view images
  const get360Images = (product: Product | null) => {
    if (!product) return [];
    
    // Normally this would come from the product data
    // Here we're generating sample 360 view images
    const categoryId = getNumericCategoryId(product);
    
    const baseImage = product.main_image || '/images/placeholder.jpg';
    
    // Create array of 12 images for full 360 rotation
    // In a real implementation, these would be actual 360 view images
    return Array(12).fill(null).map((_, index) => {
      // In a real implementation, each index would correspond to a different angle
      return index % 2 === 0 ? baseImage : (product.additional_images?.[0] || baseImage);
    });
  };
  
  // Helper function to determine product type for 3D model selection
  const getProductType = (product: Product | null): 'abaya' | 'casual' | 'bodyshaper' => {
    if (!product) return 'casual';
    
    // Logic to determine product type based on categories
    // This is a simplified example, adapt based on your actual category structure
    if (getNumericCategoryId(product) === 1) return 'abaya';
    if (getNumericCategoryId(product) === 5) return 'bodyshaper';
    
    return 'casual'; // default
  };
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-helden-purple"></div>
      </div>
    );
  }
  
  if (!product) {
    return <ProductNotFoundPage />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.products'), href: '/products' },
          { label: product.name.startsWith('products.') ? t(product.name) : product.name, href: `/products/${product.slug}` }
        ]}
      />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Product Gallery */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* View Mode Controls */}
            <div className="px-4 py-3 border-b flex justify-center space-x-4">
              <button 
                onClick={() => setViewMode('gallery')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  viewMode === 'gallery' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <FiChevronLeft size={16} />
                <FiChevronRight size={16} />
                {t('product.gallery')}
              </button>
              
              <button 
                onClick={() => setViewMode('360')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  viewMode === '360' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <TbView360 size={16} />
                {t('product.view360')}
              </button>
              
              <button 
                onClick={() => setViewMode('ar')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  viewMode === 'ar' ? 'bg-helden-purple text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <TbAugmentedReality size={16} />
                AR
              </button>
            </div>
            
            {/* Product Visuals Based on View Mode */}
            <div className="aspect-square">
              {viewMode === 'gallery' && (
                <ProductGallery 
                  images={[product.main_image, ...(product.additional_images || [])]} 
                  productName={product.name.startsWith('products.') ? t(product.name) : product.name}
                />
              )}
              
              {viewMode === '360' && (
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple"></div>
                  </div>
                }>
                  <Product360Viewer 
                    productId={product.id.toString()} 
                    productType={getProductType(product)}
                  />
                </Suspense>
              )}
              
              {viewMode === 'ar' && (
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple"></div>
                  </div>
                }>
                  <ProductARView 
                    modelPath={getModelPath(product)} 
                    productName={product.name.startsWith('products.') ? t(product.name) : product.name}
                    onClose={() => setViewMode('gallery')}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Information */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold">
            {product.name.startsWith('products.') ? t(product.name) : product.name}
          </h1>
          
          <div className="flex items-center gap-1 mt-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(Number(product.rating)) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} {t('common.reviews')})
            </span>
          </div>
          
          {/* Price with discount display */}
          <div className="text-sm mb-4">
            {product.discount && (
              <span className="line-through mr-2 text-gray-500">
                {Number(product.price)} {t('common.currency')}
              </span>
            )}
            <span className="font-bold text-xl text-helden-purple">
              {product.discount ? Number(product.discount_price) : Number(product.price)} {t('common.currency')}
            </span>
            {product.discount && (
              <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm">
                -{product.discount}% {t('discounts.off')}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">
            {product.description.startsWith('products.') ? t(product.description) : product.description}
          </p>
          
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('filters.color')}</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-helden-purple' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  ></button>
                ))}
              </div>
            </div>
          )}
          
          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('filters.size')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size
                        ? 'border-helden-purple bg-helden-purple text-white'
                        : 'border-gray-300 hover:border-helden-purple'
                    }`}
                  >
                    {t(`sizes.${size}`)}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">{t('products.quantity')}</h3>
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l disabled:opacity-50"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                min="1"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1) {
                    setQuantity(value);
                  }
                }}
                className="w-16 h-10 border-y border-gray-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button 
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Stock Status */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? t('products.inStock') : t('products.outOfStock')}
              {product.stock > 0 && ` (${product.stock} ${t('common.left')})`}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || product.stock <= 0}
              className="btn-primary py-3 px-6 flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiShoppingBag className="mr-2 h-5 w-5" />
              {t('common.addToCart')}
            </button>
            
            <button 
              onClick={handleToggleFavorite}
              className="btn-outline py-3 px-6 flex items-center justify-center gap-2"
            >
              <FiHeart className={`h-5 w-5 ${product.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
              {product.is_favorite ? t('products.removeFromWishlist') : t('products.addToWishlist')}
            </button>
          </div>
          
          {/* Category information */}
          {product.category_id && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">
                {t(`categories.about.${getCategoryName(getNumericCategoryId(product))}.title`)}
              </h2>
              <p className="text-gray-600">
                {t(`categories.about.${getCategoryName(getNumericCategoryId(product))}.description`)}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews section */}
      <ProductReviews productId={getNumericId(product)} locale={locale} />
      
      {/* Related products */}
      <RelatedProducts productId={getNumericId(product)} categoryId={getNumericCategoryId(product)} locale={locale} />

      {/* AR View Modal */}
      <AnimatePresence>
        {showARView && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-helden-purple"></div>
            </div>
          }>
            <ProductARView
              productName={product?.name?.startsWith('products.') ? t(product.name) : product.name}
              modelPath={getModelPath(product)}
              onClose={() => setShowARView(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>
      
      {/* 360 View Modal */}
      <AnimatePresence>
        {show360View && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-helden-purple"></div>
            </div>
          }>
            <Product360Viewer
              productId={product.id.toString()}
              productType={getProductType(product)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

function getCategoryName(categoryId: number): string {
  const categories = {
    1: 'abayas',
    2: 'casual',
    3: 'formal',
    4: 'sports',
    5: 'bodyShaper'
  };
  return categories[categoryId as keyof typeof categories] || 'abayas';
} 