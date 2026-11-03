'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Store,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Zap,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  sku: string;
  title: string;
  shortDesc: string;
  image: string;
  price: number;
  mrp: number;
  discount: number;
  tag: string;
  tagColor: string;
  zone: string;
  slug: string;
  emoji: string;
  bgColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'prod-001',
    sku: 'TOY-0001',
    title: 'Toy Imagine Night Projector Lamp',
    shortDesc: '360° Rotating Starry Moon & Ocean Wave Bedside Lamp',
    image: '/products/TOY-0001.jpg',
    price: 799,
    mrp: 999,
    discount: 20,
    tag: '⭐ Store Favorite',
    tagColor: 'from-amber-500 to-rose-500',
    zone: 'Discover Zone',
    slug: 'toy-imagine-night-projector-lamp-360-rotating-led',
    emoji: '🌙',
    bgColor: 'from-amber-100/70 via-rose-50 to-indigo-50/50',
  },
  {
    id: 'prod-005',
    sku: 'TOY-0005',
    title: 'Bot Robot Pioneer Dancing Robot',
    shortDesc: '360° All-Direction Movement, Flashing Disco Lights & Music',
    image: '/products/TOY-0005.jpg',
    price: 549,
    mrp: 689,
    discount: 20,
    tag: '🤖 Super Dancing Action',
    tagColor: 'from-rose-500 to-amber-500',
    zone: 'Play Zone',
    slug: 'bot-robot-pioneer-colorful-lights-music-dancing-robot',
    emoji: '🚀',
    bgColor: 'from-rose-100/70 via-amber-50 to-orange-50/50',
  },
  {
    id: 'prod-003',
    sku: 'TOY-0003',
    title: 'Storio Tweetie Sliding Track Set',
    shortDesc: 'Motorized Escalator Stair Climber with 3 Sliding Ducklings',
    image: '/products/TOY-0003.jpg',
    price: 349,
    mrp: 429,
    discount: 19,
    tag: '🐥 Toddler Best Seller',
    tagColor: 'from-yellow-500 to-emerald-500',
    zone: 'Play Zone',
    slug: 'storio-tweetie-sliding-track-set-escalator-ducklings',
    emoji: '🎵',
    bgColor: 'from-yellow-100/70 via-emerald-50 to-teal-50/50',
  },
  {
    id: 'prod-002',
    sku: 'TOY-0002',
    title: '3D Printing Pen with LCD Display',
    shortDesc: 'Creative Drawing & Crafting Tool with Colourful Filaments',
    image: '/products/TOY-0002.jpg',
    price: 649,
    mrp: 899,
    discount: 28,
    tag: '🎨 Creative STEM',
    tagColor: 'from-purple-600 to-sky-500',
    zone: 'Create Zone',
    slug: '3d-printing-pen-lcd-display-temperature-control',
    emoji: '✨',
    bgColor: 'from-purple-100/70 via-sky-50 to-pink-50/50',
  },
];

export default function HeroBanner() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleOpenActiveToy = () => {
    if (!user) {
      openAuthModal({
        title: 'Sign In to View Toy',
        subtitle: `Continue with Google to explore "${activeSlide.title}" and view all details.`,
        onSuccess: () => {
          router.push(`/products/${activeSlide.slug}`);
        },
      });
    } else {
      router.push(`/products/${activeSlide.slug}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-rose-50/40 to-white py-10 md:py-16 border-b border-amber-100/60">
      {/* Decorative whimsical shapes in background */}
      <div className="absolute top-10 left-8 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-amber-200 shadow-sm text-xs font-bold text-amber-900">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Online Store • Direct Toy Shop Inventory</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Explore Our Store&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500">
                Favorite Toys!
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Browse our verified in-store collection of 360° dancing robots, astronaut starry night projectors, 3D printing pens, and Montessori speech learning cards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <Link
                href="/products"
                className="px-7 py-4 rounded-2xl bg-toy-coral text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-rose-500/25 hover:bg-rose-600 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Browse All Toys</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleOpenActiveToy}
                className="px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Featured: {activeSlide.title.split(' ')[0]} {activeSlide.title.split(' ')[1]}</span>
              </button>
            </div>

            {/* Store Trust Marks */}
            <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Physical Store Stock</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Original Packaging</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <Award className="w-4 h-4 text-sky-600" />
                <span>Verified Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Playful Interactive Slideshow Showcase */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Slideshow Card Container */}
              <div className="relative rounded-[2.5rem] p-3 bg-white/80 backdrop-blur-md shadow-2xl border-4 border-white">
                {/* Visual Image & Details Box */}
                <div
                  onClick={handleOpenActiveToy}
                  className="group relative cursor-pointer rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-slate-100 transition-all duration-300"
                >
                  <Image
                    key={activeSlide.id}
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                    <span
                      className={`px-3 py-1 rounded-full bg-gradient-to-r ${activeSlide.tagColor} text-white font-extrabold text-[11px] shadow-md flex items-center gap-1`}
                    >
                      {activeSlide.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 font-bold text-[10px] shadow-sm">
                      {activeSlide.zone}
                    </span>
                  </div>

                  {/* Top Right Discount Bubble */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg uppercase tracking-wide animate-bounce">
                      {activeSlide.discount}% OFF
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-sm font-bold flex items-center justify-center shadow-md">
                      {activeSlide.emoji}
                    </span>
                  </div>

                  {/* Bottom Information Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white z-10">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                          SKU: {activeSlide.sku}
                        </span>
                        <h3 className="font-black text-xl sm:text-2xl text-white leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                          {activeSlide.title}
                        </h3>
                        <p className="text-xs text-slate-200 line-clamp-1">
                          {activeSlide.shortDesc}
                        </p>
                      </div>

                      {/* Pricing Tag */}
                      <div className="text-right flex-shrink-0 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                        <div className="text-xl sm:text-2xl font-black text-amber-300">
                          ₹{activeSlide.price}
                        </div>
                        <div className="text-xs text-slate-300 line-through">
                          MRP ₹{activeSlide.mrp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slideshow Controls Bar */}
                <div className="mt-3 px-2 flex items-center justify-between gap-2">
                  {/* Left / Right Arrow Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:scale-105 active:scale-95 transition-all"
                      aria-label="Previous Toy"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:scale-105 active:scale-95 transition-all"
                      aria-label="Next Toy"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex items-center gap-1.5">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={`transition-all duration-300 rounded-full h-2.5 ${
                          currentIdx === idx
                            ? 'w-7 bg-toy-coral shadow-sm shadow-rose-500/30'
                            : 'w-2.5 bg-slate-200 hover:bg-slate-400'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Click to Open Pill */}
                  <button
                    type="button"
                    onClick={handleOpenActiveToy}
                    className="text-xs font-bold text-toy-coral hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <span>Open Toy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4-Toy Interactive Thumbnail Selector Strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`relative rounded-xl p-1.5 flex items-center gap-2 border transition-all text-left ${
                        currentIdx === idx
                          ? 'border-toy-coral bg-rose-50/50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-300 bg-white/50'
                      }`}
                    >
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="hidden sm:block overflow-hidden">
                        <p className={`text-[10px] font-bold truncate ${currentIdx === idx ? 'text-toy-coral' : 'text-slate-700'}`}>
                          {slide.title.split(' ')[0]} {slide.title.split(' ')[1]}
                        </p>
                        <p className="text-[9px] font-mono text-slate-400">
                          ₹{slide.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genuine Toy Badge Underneath */}
              <div className="absolute -bottom-4 -left-3 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-slate-100 flex items-center gap-2.5 z-30">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-800">100% Genuine Items</p>
                  <p className="text-[9px] text-slate-500">Real Showroom Shelves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
