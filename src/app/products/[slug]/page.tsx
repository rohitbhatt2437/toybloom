import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductDetailInteractive from '@/components/product/ProductDetailInteractive';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, getAllProducts } from '@/lib/data-store';
import { generateProductJsonLd, generateBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';
import { Metadata } from 'next';
import { ChevronRight, Home, Sparkles } from 'lucide-react';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Toy Not Found | Toyzz',
      description: 'The requested toy product could not be located.',
    };
  }

  const title = `${product.title} | Buy Online at Toyzz`;
  const description = product.shortDescription || product.description.slice(0, 160);

  return {
    title,
    description,
    keywords: [product.title, product.brand, product.categoryName, product.ageGroup, 'kids toys', 'toyzz'],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      images: [
        {
          url: product.featuredImage,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.featuredImage],
    },
    alternates: {
      canonical: `${SITE_URL}/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.categoryName, url: `/products?category=${product.category}` },
    { name: product.title, url: `/products/${product.slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      {/* Breadcrumb Header */}
      <nav className="border-b border-slate-100 bg-white py-3.5" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto no-scrollbar">
            <li>
              <Link href="/" className="hover:text-toy-coral flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-300" /></li>
            <li>
              <Link href="/products" className="hover:text-toy-coral transition-colors">
                Products
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-300" /></li>
            <li>
              <Link
                href={`/products?category=${product.category}`}
                className="hover:text-toy-coral capitalize font-semibold transition-colors"
              >
                {product.categoryName}
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-300" /></li>
            <li className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {product.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Details Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-16">
        {/* Interactive Viewer & Purchase Block */}
        <ProductDetailInteractive product={product} />

        {/* Technical Description & Specs Grid */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-toy-coral" />
              <span>Full Product Description</span>
            </h2>
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-bold text-slate-500">{key}</span>
                    <span className="font-extrabold text-slate-800 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
                  More In {product.categoryName}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  You Might Also Love
                </h3>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold text-slate-700 hover:text-toy-coral"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
