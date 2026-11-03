'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Clock, Lock, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isPriceSet = Boolean(product.price && product.price > 0);
  const isAvailableForSale = Boolean(isPriceSet && product.status === 'active' && product.stock > 0);
  const isOutOfStock = Boolean(isPriceSet && product.stock <= 0);
  const isLowStock = Boolean(isPriceSet && product.stock > 0 && product.stock <= 4);

  const handleOpenToy = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openAuthModal({
        title: 'Sign In to View Toy',
        subtitle: `Continue with Google to view full details, photos, and verified reviews for "${product.title}".`,
        onSuccess: () => {
          router.push(`/products/${product.slug}`);
        },
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      openAuthModal({
        title: 'Sign In to Order',
        subtitle: `Continue with Google to add "${product.title}" to your cart and place your order.`,
        onSuccess: () => {
          if (isAvailableForSale) {
            addToCart(product, 1);
          }
        },
      });
      return;
    }

    if (isAvailableForSale) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="toy-card group bg-white rounded-3xl border border-slate-100 shadow-card hover:border-slate-200 overflow-hidden flex flex-col h-full relative">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {!isPriceSet ? (
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Clock className="w-3 h-3" /> Price Pending
          </span>
        ) : product.discountPercent > 0 ? (
          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            {product.discountPercent}% OFF
          </span>
        ) : null}
      </div>

      {/* SKU & Wishlist Badges */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
            isInWishlist(product._id)
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
          title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist(product._id) ? 'fill-white' : ''}`} />
        </button>
        <span className="px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-mono font-bold">
          {product.sku}
        </span>
      </div>

      {/* Real Product Photo */}
      <Link
        href={`/products/${product.slug}`}
        onClick={handleOpenToy}
        className="relative w-full aspect-square bg-slate-50 overflow-hidden block"
      >
        <Image
          src={product.featuredImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
            <span className="uppercase tracking-wider text-toy-coral">{product.brand || 'Toy Store'}</span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {product.categoryName}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            onClick={handleOpenToy}
            className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-toy-coral transition-colors mb-2 leading-snug"
          >
            {product.title}
          </Link>

          {/* Stock Count */}
          <p className="text-[11px] text-slate-500 mb-2">
            In-Stock: <strong className="text-slate-800 font-bold">{product.stock} units</strong>
          </p>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div>
          {/* Low Stock Alert */}
          {isLowStock && (
            <p className="text-[11px] font-bold text-rose-600 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Only {product.stock} left in store!
            </p>
          )}

          <div className="flex items-end justify-between pt-2 border-t border-slate-100">
            <div>
              {isPriceSet ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold">Verified Store Price</p>
                </>
              ) : (
                <div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                    Price Awaiting Approval
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Ref Amazon: {product.mrp ? `₹${product.mrp}` : 'N/A'}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isPriceSet && !isAvailableForSale}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
                isPriceSet && !isAvailableForSale
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-toy-coral text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 active:scale-95'
              }`}
              title={
                !isPriceSet
                  ? 'Awaiting owner price approval'
                  : isOutOfStock
                  ? 'Out of stock'
                  : 'Add to Cart'
              }
              aria-label="Add to cart"
            >
              {!isPriceSet ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
