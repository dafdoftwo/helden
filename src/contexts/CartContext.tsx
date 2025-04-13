"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem, Product } from '@/models/product';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (itemIndex: number) => void;
  updateItemQuantity: (itemIndex: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = items.length > 0 ? 30 : 0;
  const tax = subtotal * 0.15; // 15% VAT in Saudi Arabia
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && cart && cart.items && cart.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCart(prevCart => {
      // Check if the item already exists with the same product, size, and color
      const existingItemIndex = prevCart.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.size === size && 
          item.color === color
      );

      let newItems;

      if (existingItemIndex >= 0) {
        // If item exists, update its quantity
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // If item doesn't exist, add it
        const newItem: CartItem = {
          product,
          quantity,
          size,
          color
        };
        newItems = [...prevCart.items, newItem];
      }

      const totals = calculateCartTotals(newItems);

      return {
        items: newItems,
        ...totals
      };
    });

    // Open the cart sidebar when an item is added
    setIsOpen(true);
  };

  const removeFromCart = (itemIndex: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter((_, index) => index !== itemIndex);
      const totals = calculateCartTotals(newItems);

      // If we remove all items, also clear localStorage
      if (newItems.length === 0 && typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }

      return {
        items: newItems,
        ...totals
      };
    });
  };

  const updateItemQuantity = (itemIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemIndex);
      return;
    }

    setCart(prevCart => {
      const newItems = [...prevCart.items];
      
      if (newItems[itemIndex]) {
        newItems[itemIndex].quantity = quantity;
      }
      
      const totals = calculateCartTotals(newItems);

      return {
        items: newItems,
        ...totals
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateItemQuantity, 
      clearCart,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 