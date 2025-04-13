"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useTranslation } from '@/i18n';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  main_image: string;
  category_id: number;
  subcategory_id: number | null;
  is_favorite?: boolean;
}

interface RelatedProductsProps {
  productId: number;
  categoryId: number;
  locale: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  productId, 
  categoryId,
  locale
}) => {
  const supabase = createClientComponentClient();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    fetchUserId();
  }, [supabase]);
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        
        // Get 4 products from the same category, excluding current product
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .neq('id', productId)
          .eq('is_active', true)
          .limit(4);
        
        if (error) throw error;
        
        if (data) {
          let productsWithFavorites = [...data];
          
          // If user is logged in, check favorites
          if (userId) {
            const { data: favoritesData } = await supabase
              .from('favorites')
              .select('product_id')
              .eq('user_id', userId);
            
            if (favoritesData) {
              const favoriteIds = favoritesData.map(fav => fav.product_id);
              
              productsWithFavorites = productsWithFavorites.map(product => ({
                ...product,
                is_favorite: favoriteIds.includes(product.id)
              }));
            }
          }
          
          setProducts(productsWithFavorites);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId && productId) {
      fetchRelatedProducts();
    }
  }, [categoryId, productId, supabase, userId]);
  
  const handleToggleFavorite = async (productId: number, isFavorite: boolean) => {
    if (!userId) {
      // Redirect to login
      window.location.href = `/${locale}/auth/login?redirect=${window.location.pathname}`;
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({ user_id: userId, product_id: productId });
      }
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId
          ? { ...product, is_favorite: !isFavorite }
          : product
      ));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.main_image,
      quantity: 1,
      color: null,
      size: null,
    });
  };
  
  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">{t('product.relatedProducts')}</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200" />
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900">{t('product.relatedProducts')}</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-100">
              <Link href={`/${locale}/products/${product.slug}`}>
                <Image
                  src={product.main_image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-90"
                />
              </Link>
              
              {/* Quick actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-10 transition-all duration-300">
                <button 
                  onClick={() => handleToggleFavorite(product.id, !!product.is_favorite)}
                  className={`p-2 rounded-full ${product.is_favorite ? 'bg-red-500 text-white' : 'bg-white text-gray-900'} shadow-md hover:scale-110 transition-transform`}
                  aria-label={product.is_favorite ? t('product.removeFromWishlist') : t('product.addToWishlist')}
                >
                  <FiHeart className={product.is_favorite ? 'fill-current' : ''} />
                </button>
                
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="p-2 rounded-full bg-helden-purple text-white shadow-md hover:scale-110 transition-transform"
                  aria-label={t('product.addToCart')}
                >
                  <FiShoppingBag />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700 font-medium">
                  <Link href={`/${locale}/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {product.discount_price ? (
                  <div>
                    <span className="text-red-500">${product.discount_price}</span>
                    <span className="line-through text-gray-500 ml-2">${product.price}</span>
                  </div>
                ) : (
                  <span>${product.price}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 