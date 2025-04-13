"use client";

import React from 'react';
import { CartProvider as CartContextProvider } from '@/hooks/useCart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <CartContextProvider>{children}</CartContextProvider>;
}

export default CartProvider; 