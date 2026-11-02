import React from 'react';
import Link from 'next/link';
import { Hammer, Gamepad2, Telescope, Palette, GraduationCap, ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryZonesProps {
  categories: Category[];
}

export default function CategoryZones({ categories }: CategoryZonesProps) {
  const iconMap: Record<string, React.ReactNode> = {
    build: <Hammer className="w-6 h-6 text-amber-600" />,
    play: <Gamepad2 className="w-6 h-6 text-rose-600" />,
    discover: <Telescope className="w-6 h-6 text-sky-600" />,
    create: <Palette className="w-6 h-6 text-purple-600" />,
    learn: <GraduationCap className="w-6 h-6 text-emerald-600" />,
  };

  const borderAccentMap: Record<string, string> = {
    build: 'hover:border-amber-400 group-hover:shadow-amber-500/10',
    play: 'hover:border-rose-400 group-hover:shadow-rose-500/10',
    discover: 'hover:border-sky-400 group-hover:shadow-sky-500/10',
    create: 'hover:border-purple-400 group-hover:shadow-purple-500/10',
    learn: 'hover:border-emerald-400 group-hover:shadow-emerald-500/10',
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
            Explore By Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            The 5 Wonder Play Zones
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
            Inspired by hands-on creative discovery spaces. Find the perfect educational or playful companion for every developmental stage.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-toy-coral transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`group bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              borderAccentMap[cat.slug] || 'hover:border-slate-300'
            } flex flex-col justify-between`}
          >
            <div>
              {/* Category Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.badgeBg }}
              >
                {iconMap[cat.slug] || <Sparkles className="w-6 h-6 text-slate-600" />}
              </div>

              {/* Title & Count */}
              <h3 className="font-black text-lg text-slate-900 group-hover:text-toy-coral transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {cat.itemCount} Toys Available
              </p>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Subtle bottom arrow */}
            <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-toy-coral transition-colors">
              <span>Explore Zone</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
import { Sparkles } from 'lucide-react';
