'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isInCart: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
  placeOrderOnWhatsApp: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const WHATSAPP_NUMBER = '919976289418'; // Primary contact: 9976289418
const STORAGE_KEY = 'kbk_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    // Auto-open cart when adding an item
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  );

  const getQuantity = useCallback(
    (productId: string) =>
      items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const placeOrderOnWhatsApp = useCallback(() => {
    if (items.length === 0) return;

    const orderLines = items
      .map((item, i) => `${i + 1}. *${item.product.productName}* (${item.product.brand}) × ${item.quantity} unit${item.quantity > 1 ? 's' : ''}`)
      .join('\n');

    const message = [
      '🛒 *KBK Wholesale Order Enquiry*',
      '',
      'Hello KBK! I would like to place a wholesale order for the following products:',
      '',
      orderLines,
      '',
      '📦 Please confirm availability, pricing, and delivery details.',
      '',
      'Thank you!',
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        isInCart,
        getQuantity,
        placeOrderOnWhatsApp,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
