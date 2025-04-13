"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string | null;
  size: string | null;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number, color?: string | null, size?: string | null) => void;
  updateQuantity: (itemId: number, quantity: number, color?: string | null, size?: string | null) => void;
  clearCart: () => void;
}

// Create context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
    }

    // Calculate totals
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const priceTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    setTotalItems(itemCount);
    setTotalPrice(priceTotal);
  }, [items]);

  // Find cart item index based on id, color, and size
  const findCartItemIndex = (itemId: number, color?: string | null, size?: string | null) => {
    return items.findIndex(item => 
      item.id === itemId && 
      (color === undefined || item.color === color) && 
      (size === undefined || item.size === size)
    );
  };

  // Add item to cart
  const addToCart = (item: CartItem) => {
    const existingItemIndex = findCartItemIndex(item.id, item.color, item.size);

    if (existingItemIndex !== -1) {
      // Item exists - update quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setItems(updatedItems);
    } else {
      // New item - add to cart
      setItems([...items, item]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: number, color?: string | null, size?: string | null) => {
    const updatedItems = items.filter(item => 
      !(item.id === itemId && 
        (color === undefined || item.color === color) && 
        (size === undefined || item.size === size))
    );
    setItems(updatedItems);
  };

  // Update item quantity
  const updateQuantity = (itemId: number, quantity: number, color?: string | null, size?: string | null) => {
    if (quantity <= 0) {
      removeFromCart(itemId, color, size);
      return;
    }

    const existingItemIndex = findCartItemIndex(itemId, color, size);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity = quantity;
      setItems(updatedItems);
    }
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 