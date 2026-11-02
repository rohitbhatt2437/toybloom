'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Product, Category } from '@/types';
import {
  SlidersHorizontal,
  X,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [ageGroup, setAgeGroup] = useState(searchParams.get('ageGroup') || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with searchParams on mount or param change
  useEffect(() => {
    const qSearch = searchParams.get('search');
    if (qSearch !== null) setSearch(qSearch);
    const qCategory = searchParams.get('category');
    if (qCategory !== null) setCategory(qCategory);
    const qAge = searchParams.get('ageGroup');
    if (qAge !== null) setAgeGroup(qAge);
    const qSort = searchParams.get('sortBy');
    if (qSort !== null) setSortBy(qSort);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const ageGroups = ['All Ages', '0-2 Years', '3-5 Years', '6-8 Years', '9+ Years'];

  // Client-side filtering & sorting for instantaneous feedback
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (ageGroup !== 'all') {
      result = result.filter((p) => p.ageGroup === ageGroup);
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, search, category, ageGroup, maxPrice, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setAgeGroup('all');
    setMaxPrice(1500);
    setInStockOnly(false);
    setSortBy('featured');
    router.push('/products');
  };

  const hasActiveFilters =
    search !== '' ||
    category !== 'all' ||
    ageGroup !== 'all' ||
    maxPrice < 1500 ||
    inStockOnly ||
    sortBy !== 'featured';

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Navbar />

      {/* Catalog Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50/50 to-sky-50 border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-toy-coral uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Toyzz Exploratorium</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                All Toys & Games
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredProducts.length} of {products.length} toys in catalog
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-toy-coral" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs">
                <span className="text-slate-400 font-bold hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured & Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Filter className="w-4 h-4 text-toy-coral" />
                  <span>Filters</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-toy-coral hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Search Inside Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search toys..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Play Zones / Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Play Zones
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategory('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      category === 'all'
                        ? 'bg-toy-coral text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Play Zones</span>
                    <span className="text-[10px] opacity-80">{products.length}</span>
                  </button>

                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCategory(c.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        category === c.slug
                          ? 'bg-toy-coral text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="capitalize">{c.name}</span>
                      <span className="text-[10px] opacity-80">{c.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Age Recommendation
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setAgeGroup('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      ageGroup === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Ages
                  </button>
                  {ageGroups.map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeGroup(age)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        ageGroup === age
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                  <span>Max Price</span>
                  <span className="text-toy-coral font-black">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹100</span>
                  <span>₹1,500</span>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-toy-coral focus:ring-toy-coral accent-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {/* Active Filters Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-bold text-slate-400">Active:</span>
                {category !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    Zone: {category.toUpperCase()}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory('all')} />
                  </span>
                )}
                {ageGroup !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
                    Age: {ageGroup}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setAgeGroup('all')} />
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold">
                    &ldquo;{search}&rdquo;
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
                  </span>
                )}
                {maxPrice < 1500 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
                    Under ₹{maxPrice}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(1500)} />
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Loading & Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="w-full aspect-square bg-slate-100 rounded-2xl" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">No toys found matching filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Try adjusting your search criteria, widening the price slider, or selecting another play zone.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-toy-coral text-white font-bold text-xs shadow-md hover:bg-rose-600 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filter Toys</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Play Zones */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Play Zones
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                    category === 'all' ? 'bg-toy-coral text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  All Play Zones
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setCategory(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                      category === c.slug ? 'bg-toy-coral text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Age groups */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Age Groups
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroup(age)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      ageGroup === age ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-2xl bg-toy-coral text-white font-bold text-sm shadow-md"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading toys...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}

