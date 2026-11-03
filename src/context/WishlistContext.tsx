'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'toyzz_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user, openAuthModal } = useAuth();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveToStorage = (items: string[]) => {
    setWishlist(items);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (product: Product) => {
    if (!user) {
      openAuthModal({
        title: 'Sign In to Save Favorites',
        subtitle: `Continue with Google to add "${product.title}" to your wishlist.`,
        onSuccess: () => {
          if (!wishlist.includes(product._id)) {
            saveToStorage([...wishlist, product._id]);
          }
        },
      });
      return;
    }

    if (wishlist.includes(product._id)) {
      saveToStorage(wishlist.filter((id) => id !== product._id));
    } else {
      saveToStorage([...wishlist, product._id]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

