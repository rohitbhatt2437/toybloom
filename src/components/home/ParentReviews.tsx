import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export default function ParentReviews() {
  const reviews = [
    {
      id: 1,
      author: 'Ananya S.',
      location: 'Bengaluru',
      childAge: 'Parent of 4-year-old',
      product: 'Toy Imagine Night Projector Lamp',
      rating: 5,
      content:
        'The astronaut galaxy projector is pure magic! My 4yo used to be scared of dark bedrooms, but now he looks forward to bedtime gazing at the moon and stars on his ceiling.',
      verified: true,
    },
    {
      id: 2,
      author: 'Vikram Joshi',
      location: 'Pune',
      childAge: 'Parent of 3-year-old',
      product: 'Talking Flash Cards Montessori Reader',
      rating: 5,
      content:
        'The speech therapist recommended talking cards for speech delay. Within two weeks, my toddler started repeating animal and vehicle sounds! Outstanding build quality.',
      verified: true,
    },
    {
      id: 3,
      author: 'Neha Kapoor',
      location: 'Delhi NCR',
      childAge: 'Parent of 5 & 7-year-olds',
      product: '3D Printing Pen + Filaments',
      rating: 5,
      content:
        'Kept both my kids engaged screen-free for entire weekend afternoons. The temperature control is safe and the LCD display makes it super intuitive.',
      verified: true,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50/40 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
            Loved By Families
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Real Parents. Real Smiles.
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Read verified reviews from moms, dads, and educators who trust Toyzz for safe, stimulating childhood play.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {r.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{r.author}</h4>
                    <p className="text-[11px] text-slate-400">{r.location} • {r.childAge}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-toy-coral line-clamp-1 max-w-[120px]">
                      {r.product}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
