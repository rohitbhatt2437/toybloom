import { Product } from '@/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toyzz.in';
export const SITE_NAME = 'Toyzz – Explore, Play, Discover & Create';
export const DEFAULT_DESCRIPTION =
  'India’s favorite kids wonderland for educational toys, dancing robots, Montessori learning cards, starry night projectors, building blocks, and creative craft sets.';

export function generateProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.shortDescription || product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Toyzz Store India',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
      bestRating: 5,
      worstRating: 1,
    },
    audience: {
      '@type': 'PeopleAudience',
      suggestedGender: 'unisex',
      suggestedAge: {
        '@type': 'QuantitativeValue',
        name: product.ageGroup,
      },
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateStoreJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ToyStore',
    name: 'Toyzz',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, NetBanking',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-800-TOYZZ-01',
      contactType: 'Customer Support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

