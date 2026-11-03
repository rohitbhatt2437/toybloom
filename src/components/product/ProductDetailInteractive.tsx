'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Minus,
  Plus,
  Sparkles,
  Lock,
  Clock,
  AlertCircle,
  Heart,
} from 'lucide-react';

export default function ProductDetailInteractive({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(product.featuredImage || product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const isPriceSet = Boolean(product.price && product.price > 0);
  const isAvailableForSale = Boolean(isPriceSet && product.status === 'active' && product.stock > 0);
  const isLowStock = Boolean(isPriceSet && product.stock > 0 && product.stock <= 4);
  const isOutOfStock = Boolean(isPriceSet && product.stock <= 0);

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal({
        title: 'Sign In to Order',
        subtitle: `Continue with Google to add "${product.title}" to your cart and place your order.`,
        onSuccess: () => {
          if (isAvailableForSale) {
            addToCart(product, quantity);
          }
        },
      });
      return;
    }

    if (isAvailableForSale) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      openAuthModal({
        title: 'Sign In to Order',
        subtitle: `Continue with Google to order "${product.title}" with same-day packaging.`,
        onSuccess: () => {
          if (isAvailableForSale) {
            addToCart(product, quantity);
            router.push('/checkout');
          }
        },
      });
      return;
    }

    if (isAvailableForSale) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
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

          {/* Price Pending Badge */}
          {!isPriceSet && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Price Awaiting Approval
              </span>
            </div>
          )}

          {/* Wishlist & Share Buttons */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors ${
                isInWishlist(product._id)
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500'
              }`}
              title={isInWishlist(product._id) ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-700 hover:text-toy-coral transition-colors"
              title="Share Toy"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
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
              {product.brand || 'Toy Store'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-500 capitalize bg-slate-100 px-2.5 py-0.5 rounded-full">
              {product.categoryName} Zone
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              SKU: {product.sku}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {product.title}
          </h1>

          {/* Stock info */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              Current In-Hand Stock: <strong>{product.stock} units</strong>
            </span>
            <span className="text-xs text-slate-400">Snapshot: 27-Aug-2026</span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
          {isPriceSet ? (
            <div>
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
              <p className="text-xs text-emerald-600 font-bold mt-1">
                Verified Store Selling Price
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>Selling Price Not Yet Set by Store Owner</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This item is from our genuine in-store inventory. The retail selling price is pending approval in the Admin Portal and cannot be purchased online yet.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                {product.mrp > 0 && <span>Amazon Ref: <strong>₹{product.mrp}</strong></span>}
                <span>In-Stock: <strong>{product.stock}</strong></span>
              </div>
            </div>
          )}

          {/* Stock Notification */}
          {isPriceSet && (
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
                  In Stock in Our Store
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quantity & CTA Buttons */}
        <div className="space-y-4 pt-2">
          {isAvailableForSale && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailableForSale}
              className={`py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                !isAvailableForSale
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
              }`}
            >
              {!isPriceSet ? <Lock className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{!isPriceSet ? 'Price Approval Pending' : isOutOfStock ? 'Out of Stock' : 'Add to Toy Box'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!isAvailableForSale}
              className={`py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                !isAvailableForSale
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-toy-coral text-white hover:bg-rose-600 shadow-lg shadow-rose-500/25'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

        {/* Store Trust Badges */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-800">Physical Stock</p>
            <p className="text-[10px] text-slate-400">Direct From Shop</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Truck className="w-5 h-5 text-sky-600 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-800">Secure Dispatch</p>
            <p className="text-[10px] text-slate-400">Doorstep Delivery</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-800">In-Store Support</p>
            <p className="text-[10px] text-slate-400">Dedicated Help</p>
          </div>
        </div>

        {/* Features / Specifications */}
        {product.features && product.features.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-toy-coral" />
              <span>Features in Manufacturer Listing</span>
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
