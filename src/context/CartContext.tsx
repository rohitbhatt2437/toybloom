'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  finalTotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const freeShippingThreshold = 499;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('toyzz_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('toyzz_coupon');
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
      }
    } catch (err) {
      console.error('Failed to load cart from storage', err);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('toyzz_cart', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to storage', err);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem('toyzz_cart');
    localStorage.removeItem('toyzz_coupon');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon.code);
        setDiscount(data.coupon.discount);
        localStorage.setItem('toyzz_coupon', data.coupon.code);
        return { success: true, message: `Coupon ${data.coupon.code} applied! Saved ₹${data.coupon.discount}` };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
    } catch {
      return { success: false, message: 'Failed to apply coupon. Try again.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem('toyzz_coupon');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        finalTotal,
        freeShippingThreshold,
        shippingFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

