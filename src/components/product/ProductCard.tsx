'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const isLowStock = product.stock > 0 && product.stock <= 4;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="toy-card group bg-white rounded-3xl border border-slate-100/80 shadow-card hover:border-slate-200 overflow-hidden flex flex-col h-full relative">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercent > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wide flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 fill-slate-900" /> Best Seller
          </span>
        )}
      </div>

      {/* Age Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold">
          {product.ageGroup}
        </span>
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
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
            <span className="uppercase tracking-wider text-toy-coral">{product.brand}</span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {product.categoryName}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-toy-coral transition-colors mb-2 leading-snug"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div>
          {/* Stock Alert */}
          {isLowStock && (
            <p className="text-[11px] font-bold text-rose-600 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Only {product.stock} left in stock!
            </p>
          )}

          <div className="flex items-end justify-between pt-2 border-t border-slate-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
                )}
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold">Inclusive of all taxes</p>
            </div>

            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-toy-coral text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 active:scale-95'
              }`}
              title={isOutOfStock ? 'Sold Out' : 'Add to Toy Box'}
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
