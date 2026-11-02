'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Share2,
  Minus,
  Plus,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailInteractive({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(product.featuredImage || product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const isLowStock = product.stock > 0 && product.stock <= 4;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch {
        // Ignore dismiss
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Display */}
        <div className="relative w-full aspect-square rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                {product.discountPercent}% OFF
              </span>
            </div>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-700 hover:text-toy-coral transition-colors"
            title="Share Toy"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && (
            <div className="absolute top-16 right-4 z-10 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
              Link copied!
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === img
                    ? 'border-toy-coral scale-105 shadow-md'
                    : 'border-slate-200/80 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Details & Purchasing */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          {/* Brand & Zone */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
              {product.brand}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-500 capitalize bg-slate-100 px-2.5 py-0.5 rounded-full">
              {product.categoryName} Zone
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Age: {product.ageGroup}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {product.title}
          </h1>

          {/* Rating & SKU */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-amber-900">{product.rating}</span>
              <span className="text-xs text-amber-700">({product.reviewCount} reviews)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-slate-400 line-through">₹{product.mrp}</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Save ₹{product.mrp - product.price}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Taxes included. Free delivery available on orders above ₹499.
          </p>

          {/* Stock Notification */}
          <div className="pt-2">
            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                Currently Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Hurry! Only {product.stock} items remaining
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                In Stock & Ready for Same-Day Dispatch
              </span>
            )}
          </div>
        </div>

        {/* Quantity & CTA Buttons */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                disabled={isOutOfStock}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                disabled={isOutOfStock || quantity >= product.stock}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 shadow-md transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Toy Box</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="py-4 px-6 rounded-2xl bg-toy-coral text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-600 shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-800">ISI Certified</p>
            <p className="text-[10px] text-slate-400">100% Non-Toxic</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Truck className="w-5 h-5 text-sky-600 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-800">Fast Shipping</p>
            <p className="text-[10px] text-slate-400">2-4 Days Delivery</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-800">Easy Returns</p>
            <p className="text-[10px] text-slate-400">7-Day Replacement</p>
          </div>
        </div>

        {/* Key Features Bullet List */}
        {product.features && product.features.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-toy-coral" />
              <span>Toy Highlights</span>
            </h3>
            <ul className="space-y-2">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-toy-coral mt-1.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
