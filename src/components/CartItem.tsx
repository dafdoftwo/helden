"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { CartItem as CartItemType } from '@/models/product';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, size, color } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product.stock && newQuantity > product.stock) return;
    updateQuantity(product.id, newQuantity, size, color);
  };

  const handleRemove = () => {
    removeFromCart(product.id, size, color);
  };

  return (
    <div className="flex items-start py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={product.image}
          alt={t(product.name)}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="text-sm font-medium text-gray-800">{t(product.name)}</h3>
        
        {/* Product Attributes */}
        <div className="mt-1 text-xs text-gray-500 space-y-1">
          {size && (
            <p>
              {t('product.size')}: {size}
            </p>
          )}
          {color && (
            <p>
              {t('product.color')}: {color}
            </p>
          )}
          <p className="font-medium text-helden-purple-dark">
            {product.price} {t('common.price')}
          </p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center ml-4">
        <div className="flex border border-gray-300 rounded">
          <button
            type="button"
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            -
          </button>
          <span className="px-2 py-1 min-w-[30px] text-center">{quantity}</span>
          <button
            type="button"
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>
        
        {/* Remove Button */}
        <button
          type="button"
          className="ml-2 text-sm text-red-500 hover:text-red-600"
          onClick={handleRemove}
        >
          {t('cart.remove')}
        </button>
      </div>
    </div>
  );
};

export default CartItem; 