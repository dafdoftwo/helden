"use client";

import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaTimes, FaMinus, FaPlus, FaStar } from 'react-icons/fa';
import { useTranslation } from '../i18n';

// Mock product type - in a real app, you would use your actual product type
interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
}

interface QuickShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const QuickShopModal: React.FC<QuickShopModalProps> = ({ isOpen, onClose, product }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedColor(product.colors?.[0]?.hex || null);
      setIsWishlisted(false);
    }
  }, [product]);
  
  if (!product) return null;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    // In a real app, this would call a function to add the product to the cart
    console.log('Adding to cart:', {
      product,
      quantity,
      selectedSize,
      selectedColor
    });
    
    // Close the modal after adding to cart
    onClose();
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };
  
  const actualPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={onClose}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Images */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={product.images[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-cover object-center"
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-md">
                          -{product.discount}%
                        </div>
                      )}
                      {product.isNew && !product.discount && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-sm font-medium px-2 py-1 rounded-md">
                          New
                        </div>
                      )}
                      {product.isBestseller && !product.isNew && !product.discount && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-sm font-medium px-2 py-1 rounded-md">
                          Bestseller
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative w-16 h-16 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-helden-purple' : 'ring-1 ring-gray-200'}`}
                          >
                            <Image
                              src={image}
                              alt={`${product.name} - Image ${index + 1}`}
                              fill
                              className="object-cover object-center"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold text-gray-900"
                      >
                        {product.name}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                    </div>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${i < Math.floor(product.rating || 0) ? 'text-amber-400' : 'text-gray-300'} w-4 h-4`}
                          />
                        ))}
                        {product.reviews && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({product.reviews} reviews)
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className={`text-xl font-bold ${product.discount ? 'text-red-600' : 'text-gray-900'}`}>
                        {actualPrice.toFixed(2)} SAR
                      </span>
                      {product.discount && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.toFixed(2)} SAR
                        </span>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-700">
                      {product.description || "No description available for this product."}
                    </p>
                    
                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Size</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1 border text-sm font-medium rounded-md transition-colors ${
                                selectedSize === size
                                  ? 'border-helden-purple bg-helden-purple/10 text-helden-purple'
                                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Color</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => (
                            <button
                              key={color.hex}
                              onClick={() => setSelectedColor(color.hex)}
                              className={`w-8 h-8 rounded-full transition-transform ${selectedColor === color.hex ? 'ring-2 ring-offset-2 ring-helden-purple scale-110' : ''}`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quantity */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Quantity</h4>
                      <div className="flex items-center">
                        <button
                          onClick={decreaseQuantity}
                          className="border border-gray-300 rounded-l-md p-2 hover:bg-gray-100"
                          disabled={quantity <= 1}
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <div className="w-12 text-center border-y border-gray-300 py-2">
                          {quantity}
                        </div>
                        <button
                          onClick={increaseQuantity}
                          className="border border-gray-300 rounded-r-md p-2 hover:bg-gray-100"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                          product.inStock
                            ? 'bg-helden-purple hover:bg-helden-purple-dark'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      
                      <button
                        onClick={toggleWishlist}
                        className={`p-3 rounded-lg border transition-colors ${
                          isWishlisted
                            ? 'border-red-500 bg-red-50 text-red-500'
                            : 'border-gray-300 text-gray-500 hover:border-gray-400'
                        }`}
                        aria-label="Add to wishlist"
                      >
                        <FaHeart className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* View Full Details Link */}
                    <div className="text-center pt-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm text-helden-purple hover:text-helden-purple-dark hover:underline"
                        onClick={onClose}
                      >
                        View full details
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuickShopModal; 