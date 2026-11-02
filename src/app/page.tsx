import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryZones from '@/components/home/CategoryZones';
import DealsBanner from '@/components/home/DealsBanner';
import ParentReviews from '@/components/home/ParentReviews';
import ProductCard from '@/components/product/ProductCard';
import { getAllProducts, getAllCategories } from '@/lib/data-store';
import { generateStoreJsonLd } from '@/lib/seo';
import { Flame, Sparkles, Trophy, ArrowRight, Zap } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const featuredToys = products.filter((p) => p.isFeatured).slice(0, 4);
  const topDiscounted = [...products]
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 4);

  const featuredBrands = [
    { name: 'Toy Imagine', badge: 'Galaxy & Lighting' },
    { name: 'Storio', badge: 'Play Tracks' },
    { name: 'MakerKids', badge: 'STEM 3D Crafts' },
    { name: 'Pioneer', badge: 'Robotics & Beats' },
    { name: 'PocketVocab', badge: 'Montessori Speech' },
    { name: 'Sank', badge: 'Magic Handwriting' },
    { name: 'Wembley', badge: 'Tumbling Toys' },
    { name: 'LAALIYA', badge: 'Sound Books' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      {/* Schema.org Store Metadata for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStoreJsonLd()) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroBanner />

        {/* 2. Featured Categories (The 5 Play Zones) */}
        <CategoryZones categories={categories} />

        {/* 3. Best-Selling Toys */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-600 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Parents&apos; Top Picks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Best-Selling Toys
              </h2>
            </div>
            <Link
              href="/products?sortBy=featured"
              className="text-xs font-bold text-slate-700 hover:text-toy-coral flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Special Offers & Deals Banner */}
        <DealsBanner />

        {/* 5. Trending & Popular Toys */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-rose-600 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Hot In Demand</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Trending Toys
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-slate-700 hover:text-toy-coral flex items-center gap-1 transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredToys.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. New Arrivals */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-sky-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Just Landed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products?sortBy=newest"
              className="text-xs font-bold text-slate-700 hover:text-toy-coral flex items-center gap-1 transition-colors"
            >
              <span>See What&apos;s New</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. Special Discounts & Clearance (Up to 50% Off) */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Super Saver Deals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Highest Discount Toys
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-slate-700 hover:text-toy-coral flex items-center gap-1 transition-colors"
            >
              <span>View All Discounts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDiscounted.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 8. Featured Brands */}
        <section className="py-12 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Crafted by Leading Toy Innovators
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">
                Featured Brands We Partner With
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/products?search=${encodeURIComponent(brand.name)}`}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/80 border border-slate-100 hover:border-amber-200 transition-all text-center flex flex-col justify-center items-center group"
                >
                  <p className="font-extrabold text-sm text-slate-800 group-hover:text-toy-coral transition-colors">
                    {brand.name}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {brand.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Customer Testimonials and Reviews */}
        <ParentReviews />
      </main>

      <Footer />
    </div>
  );
}
