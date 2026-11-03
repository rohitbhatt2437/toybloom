import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryZones from '@/components/home/CategoryZones';
import ProductCard from '@/components/product/ProductCard';
import { getAllProducts, getAllCategories } from '@/lib/data-store';
import { generateStoreJsonLd } from '@/lib/seo';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Heart, Package, Store } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const featuredToys = products.slice(0, 8);
  const learningToys = products.filter((p) => p.category === 'learn').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      {/* Schema.org Store Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStoreJsonLd()) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroBanner />

        {/* 2. Featured Categories (The Play Zones) */}
        <CategoryZones categories={categories} />

        {/* 3. Featured Store Products */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-toy-coral mb-1">
                <Store className="w-3.5 h-3.5" />
                <span>Shop Catalogue</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our In-Store Collection
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-slate-700 hover:text-toy-coral flex items-center gap-1 transition-colors"
            >
              <span>View All ({products.length} Products)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredToys.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Educational & Montessori Spotlight */}
        {learningToys.length > 0 && (
          <section className="py-12 bg-emerald-50/50 border-y border-emerald-100/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-1 block">
                    Screen-Free Montessori
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Educational & Speech Toys
                  </h2>
                </div>
                <Link
                  href="/products?category=learn"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
                >
                  <span>Explore Learning Zone</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {learningToys.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Authentic Store Assurance */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm max-w-3xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              About Our Toy Store
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every toy featured on our website is part of our verified shop inventory. Each item has been personally inspected to meet safety and developmental standards for children.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Non-Toxic Materials
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-sky-600" />
                Careful Packaging & Direct Dispatch
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
