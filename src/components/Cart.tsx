"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch by only showing cart after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Cart panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {t('cart.title')} ({totalItems})
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">{t('cart.close')}</span>
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
                <button
                  type="button"
                  className="text-helden-purple hover:text-helden-purple-dark"
                  onClick={onClose}
                >
                  {t('cart.continueShopping')}
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={`${item.id}-${item.color}-${item.size}`} className="py-6 flex">
                    {/* Product image */}
                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    {/* Product details */}
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/products/${item.id}`} className="hover:underline">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4">${item.price}</p>
                        </div>
                        {(item.color || item.size) && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color && (
                              <span 
                                className="inline-block w-3 h-3 mr-1 rounded-full" 
                                style={{ backgroundColor: item.color }} 
                              />
                            )}
                            {item.size && <span>{item.size}</span>}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-1 flex items-end justify-between text-sm">
                        {/* Quantity */}
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="p-1 text-gray-500 hover:text-gray-700"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="px-2 text-gray-700">{item.quantity}</span>
                          <button 
                            className="p-1 text-gray-500 hover:text-gray-700"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Remove */}
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.id, item.color, item.size)}
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>{t('cart.subtotal')}</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center rounded-md border border-transparent bg-helden-purple px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-helden-purple-dark w-full"
                  onClick={onClose}
                >
                  {t('cart.checkout')}
                </Link>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full"
                  onClick={clearCart}
                >
                  {t('cart.clear')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart; 