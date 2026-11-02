export type AgeGroup = '0-2 Years' | '3-5 Years' | '6-8 Years' | '9+ Years' | 'All Ages';

export type CategorySlug = 'build' | 'play' | 'discover' | 'create' | 'learn';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
  badgeColor: string;
  badgeBg: string;
  bannerImage: string;
  itemCount: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: CategorySlug;
  categoryName: string;
  brand: string;
  ageGroup: AgeGroup;
  price: number;
  mrp: number;
  purchasePrice?: number;
  discountPercent: number;
  stock: number;
  images: string[];
  featuredImage: string;
  features: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDealOfTheDay?: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface UserAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: UserAddress[];
  createdAt?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  comment?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: UserAddress;
  paymentInfo: {
    method: 'razorpay' | 'cod';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paidAt?: string;
  };
  pricing: {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    taxAmount: number;
    total: number;
  };
  couponApplied?: string;
  orderStatus: OrderStatus;
  statusTimeline: OrderStatusHistory[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface FilterState {
  search?: string;
  category?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

