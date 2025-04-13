'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'addedAt'>) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setIsInitialized(true);
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isInitialized]);

  // Add item to cart
  const addItem = (newItem: Omit<CartItem, 'addedAt'>) => {
    setItems(prevItems => {
      // Check if item already exists with same product, color, and size
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.productId === newItem.productId && 
          item.color === newItem.color && 
          item.size === newItem.size
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...newItem, addedAt: new Date().toISOString() }];
      }
    });
    
    // Open cart drawer when adding items
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeItem = (productId: string, color?: string, size?: string) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item.productId === productId && 
          item.color === color && 
          item.size === size)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId && 
        item.color === color && 
        item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate total items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Context value
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    isCartOpen,
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider; 