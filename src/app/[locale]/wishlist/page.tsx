"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/components/I18nProvider';
import { FiShoppingBag, FiTrash2, FiHeart } from 'react-icons/fi';

interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    main_image: string;
    stock: number;
    is_active: boolean;
    colors: string[] | null;
    sizes: string[] | null;
  };
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        // If not logged in, redirect to login page
        if (!authLoading) {
          router.push(`/${language}/auth/login?returnUrl=/${language}/wishlist`);
        }
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch wishlist items with product details
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists')
          .select(`
            id,
            user_id,
            product_id,
            created_at,
            product:products (
              id,
              name,
              slug,
              price,
              discount_price,
              main_image,
              stock,
              is_active,
              colors,
              sizes
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (wishlistError) throw wishlistError;
        
        // Filter out products that are inactive and ensure proper type casting
        if (wishlistData) {
          const activeItems = wishlistData
            .filter(item => item.product && item.product.is_active)
            .map(item => ({
              ...item,
              product: item.product as unknown as WishlistItem['product'] // Cast to the correct type
            }));
            
          setWishlistItems(activeItems);
        }
      } catch (err: any) {
        console.error('Error fetching wishlist:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [user, authLoading, router, language]);
  
  const handleRemoveItem = async (itemId: number) => {
    try {
      // Remove the item from the database
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Update state to remove the item from the UI
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      console.error('Error removing wishlist item:', err);
      setError(err.message);
    }
  };
  
  const handleAddToCart = (item: WishlistItem) => {
    // Add the product to the cart
    addToCart(
      {
        id: item.product.id,
        name: item.product.name,
        price: item.product.discount_price || item.product.price,
        image: item.product.main_image,
        images: [item.product.main_image],
        description: '',
        category: ''
      },
      1,
      item.product.sizes ? item.product.sizes[0] : undefined,
      item.product.colors ? item.product.colors[0] : undefined
    );
    
    // Optionally remove from wishlist
    handleRemoveItem(item.id);
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Will redirect in the useEffect
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">{t('common.redirecting')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">{t('wishlist.title')}</h1>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiHeart className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow overflow-hidden">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="h-16 w-16 mx-auto text-gray-300" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">{t('wishlist.empty')}</h2>
            <p className="mt-2 text-sm text-gray-500">{t('wishlist.emptyMessage')}</p>
            <div className="mt-6">
              <Link
                href={`/${language}/products`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {t('wishlist.startShopping')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg"
              >
                <Link href={`/${language}/products/${item.product.slug}`}>
                  <div className="relative h-64 w-full">
                    <Image
                      src={item.product.main_image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/${language}/products/${item.product.slug}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-helden-purple truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-2 flex justify-between items-center">
                    {item.product.discount_price ? (
                      <div>
                        <span className="text-helden-purple-dark font-bold">
                          {item.product.discount_price} {t('common.currency')}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {item.product.price} {t('common.currency')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-helden-purple-dark font-bold">
                        {item.product.price} {t('common.currency')}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stock <= 0}
                      className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${item.product.stock > 0 
                          ? 'bg-black hover:bg-gray-800' 
                          : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                      <FiShoppingBag className="mr-2 h-4 w-4" />
                      {item.product.stock > 0 
                        ? t('wishlist.addToCart') 
                        : t('common.outOfStock')}
                    </button>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 border border-gray-300 rounded-md text-gray-500 hover:text-red-500 hover:border-red-500"
                      aria-label={t('wishlist.remove')}
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 