import fs from 'fs/promises';
import path from 'path';
import { Product, Category, Order, User, Coupon, OrderStatus, FilterState } from '@/types';
import { initialCategories, initialProducts, initialCoupons } from './seed-data';
import { hashPassword } from './auth';

interface StoreData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: (User & { passwordHash: string })[];
  coupons: Coupon[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

let memoryStore: StoreData | null = null;

async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore if directory exists
  }
}

async function initDefaultStore(): Promise<StoreData> {
  const adminPassword = await hashPassword('admin123');
  const parentPassword = await hashPassword('parent123');

  const defaultUsers: (User & { passwordHash: string })[] = [
    {
      _id: 'user-admin-001',
      name: 'Toyzz Store Manager',
      email: 'admin@toyzz.com',
      passwordHash: adminPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      addresses: [],
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'user-parent-002',
      name: 'Priya Sharma',
      email: 'parent@toyzz.com',
      passwordHash: parentPassword,
      role: 'customer',
      phone: '+91 91234 56789',
      addresses: [
        {
          fullName: 'Priya Sharma',
          phone: '+91 91234 56789',
          street: 'Flat 402, Sunshine Meadows, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          landmark: 'Near 100ft Road Metro',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  // Seed sample orders for analytics & tracking demo
  const sampleOrders: Order[] = [
    {
      _id: 'ord-001',
      orderNumber: 'TYZ-2026-90412',
      customer: {
        userId: 'user-parent-002',
        name: 'Priya Sharma',
        email: 'parent@toyzz.com',
        phone: '+91 91234 56789',
      },
      items: [
        {
          productId: 'prod-001',
          title: 'Toy Imagine Night Projector Lamp 360° Rotating LED Starry Light',
          price: 699,
          quantity: 1,
          image: initialProducts[0].featuredImage,
          slug: initialProducts[0].slug,
        },
        {
          productId: 'prod-006',
          title: 'LCD Magic Writing & Drawing Tablet (8.5 Inch Multicolour Screen)',
          price: 150,
          quantity: 1,
          image: initialProducts[5].featuredImage,
          slug: initialProducts[5].slug,
        },
      ],
      shippingAddress: {
        fullName: 'Priya Sharma',
        phone: '+91 91234 56789',
        street: 'Flat 402, Sunshine Meadows, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        landmark: 'Near 100ft Road Metro',
        isDefault: true,
      },
      paymentInfo: {
        method: 'razorpay',
        status: 'paid',
        razorpayOrderId: 'order_DEMO90412',
        razorpayPaymentId: 'pay_DEMO90412',
        paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      pricing: {
        subtotal: 849,
        discountAmount: 85,
        shippingFee: 0,
        taxAmount: 0,
        total: 764,
      },
      couponApplied: 'TOYZZ10',
      orderStatus: 'shipped',
      statusTimeline: [
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          comment: 'Payment verified successfully via Razorpay UPI.',
        },
        {
          status: 'processing',
          timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
          comment: 'Order packed with bubble protection at Bengaluru Central Hub.',
        },
        {
          status: 'shipped',
          timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
          comment: 'Dispatched via Express Courier. Tracking: BLR-TYZ-90412',
        },
      ],
      trackingNumber: 'BLR-TYZ-90412',
      estimatedDelivery: 'Tomorrow by 4:00 PM',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 0.8).toISOString(),
    },
  ];

  return {
    products: initialProducts,
    categories: initialCategories,
    orders: sampleOrders,
    users: defaultUsers,
    coupons: initialCoupons,
  };
}

async function getStore(): Promise<StoreData> {
  if (memoryStore) {
    return memoryStore;
  }

  await ensureDataDirectory();

  try {
    const raw = await fs.readFile(STORE_FILE, 'utf-8');
    memoryStore = JSON.parse(raw);
    return memoryStore!;
  } catch {
    memoryStore = await initDefaultStore();
    await saveStore();
    return memoryStore;
  }
}

async function saveStore(): Promise<void> {
  if (!memoryStore) return;
  await ensureDataDirectory();
  await fs.writeFile(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
}

// ======================== PRODUCT OPERATIONS ========================

export async function getAllProducts(filters?: FilterState): Promise<Product[]> {
  const store = await getStore();
  let list = [...store.products];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  if (filters?.category && filters.category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.ageGroup && filters.ageGroup !== 'all') {
    list = list.filter((p) => p.ageGroup === filters.ageGroup);
  }

  if (filters?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters?.inStockOnly) {
    list = list.filter((p) => p.stock > 0);
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = await getStore();
  return store.products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = await getStore();
  return store.products.find((p) => p._id === id) || null;
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const store = await getStore();
  const slug =
    productData.slug ||
    productData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
    `prod-${Date.now()}`;

  const newProduct: Product = {
    _id: `prod-${Date.now()}`,
    title: productData.title || 'Untitled Toy',
    slug,
    sku: productData.sku || `TYZ-${Date.now().toString().slice(-6)}`,
    description: productData.description || '',
    shortDescription: productData.shortDescription || '',
    category: (productData.category as any) || 'play',
    categoryName: productData.categoryName || 'Play',
    brand: productData.brand || 'Toyzz',
    ageGroup: productData.ageGroup || 'All Ages',
    price: Number(productData.price) || 0,
    mrp: Number(productData.mrp) || Number(productData.price) || 0,
    purchasePrice: Number(productData.purchasePrice) || 0,
    discountPercent:
      productData.mrp && productData.price
        ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
        : 0,
    stock: Number(productData.stock) || 0,
    images: productData.images?.length ? productData.images : [productData.featuredImage || ''],
    featuredImage: productData.featuredImage || productData.images?.[0] || '',
    features: productData.features || [],
    specifications: productData.specifications || {},
    rating: productData.rating || 5.0,
    reviewCount: productData.reviewCount || 1,
    isFeatured: !!productData.isFeatured,
    isBestSeller: !!productData.isBestSeller,
    isNewArrival: productData.isNewArrival !== undefined ? productData.isNewArrival : true,
    status: productData.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.products.unshift(newProduct);
  await saveStore();
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const store = await getStore();
  const index = store.products.findIndex((p) => p._id === id);
  if (index === -1) return null;

  const existing = store.products[index];
  const updated: Product = {
    ...existing,
    ...updates,
    discountPercent:
      updates.mrp && updates.price
        ? Math.round(((updates.mrp - updates.price) / updates.mrp) * 100)
        : existing.discountPercent,
    updatedAt: new Date().toISOString(),
  };

  store.products[index] = updated;
  await saveStore();
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = await getStore();
  const index = store.products.findIndex((p) => p._id === id);
  if (index === -1) return false;
  store.products.splice(index, 1);
  await saveStore();
  return true;
}

// ======================== CATEGORY OPERATIONS ========================

export async function getAllCategories(): Promise<Category[]> {
  const store = await getStore();
  // Dynamically update product counts
  return store.categories.map((c) => ({
    ...c,
    itemCount: store.products.filter((p) => p.category.toLowerCase() === c.slug.toLowerCase()).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

// ======================== ORDER OPERATIONS ========================

export async function getAllOrders(userId?: string): Promise<Order[]> {
  const store = await getStore();
  if (userId) {
    return store.orders.filter((o) => o.customer.userId === userId);
  }
  return [...store.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  const store = await getStore();
  return store.orders.find((o) => o._id === id || o.orderNumber === id) || null;
}

export async function createOrder(data: {
  customer: { userId?: string; name: string; email: string; phone: string };
  items: Order['items'];
  shippingAddress: Order['shippingAddress'];
  paymentInfo: Order['paymentInfo'];
  pricing: Order['pricing'];
  couponApplied?: string;
}): Promise<Order> {
  const store = await getStore();

  const orderNumber = `TYZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    _id: `ord-${Date.now()}`,
    orderNumber,
    customer: data.customer,
    items: data.items,
    shippingAddress: data.shippingAddress,
    paymentInfo: data.paymentInfo,
    pricing: data.pricing,
    couponApplied: data.couponApplied,
    orderStatus: 'confirmed',
    statusTimeline: [
      {
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        comment: data.paymentInfo.method === 'razorpay'
          ? 'Order confirmed. Online payment verified.'
          : 'Order confirmed with Cash on Delivery.',
      },
    ],
    trackingNumber: `TYZ-TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
    estimatedDelivery: 'In 2-4 Business Days',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Decrement product stock
  for (const item of data.items) {
    const prod = store.products.find((p) => p._id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  store.orders.unshift(newOrder);
  await saveStore();
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  comment?: string
): Promise<Order | null> {
  const store = await getStore();
  const order = store.orders.find((o) => o._id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.orderStatus = newStatus;
  order.statusTimeline.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    comment: comment || `Status updated to ${newStatus}`,
  });
  order.updatedAt = new Date().toISOString();

  await saveStore();
  return order;
}

export async function updateOrderPayment(
  orderId: string,
  paymentData: {
    status: 'paid' | 'failed';
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }
): Promise<Order | null> {
  const store = await getStore();
  const order = store.orders.find((o) => o._id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.paymentInfo.status = paymentData.status;
  if (paymentData.razorpayPaymentId) {
    order.paymentInfo.razorpayPaymentId = paymentData.razorpayPaymentId;
  }
  if (paymentData.razorpaySignature) {
    order.paymentInfo.razorpaySignature = paymentData.razorpaySignature;
  }
  if (paymentData.status === 'paid') {
    order.paymentInfo.paidAt = new Date().toISOString();
  }
  order.updatedAt = new Date().toISOString();

  await saveStore();
  return order;
}

// ======================== COUPON OPERATIONS ========================

export async function getCoupon(code: string): Promise<Coupon | null> {
  const store = await getStore();
  return (
    store.coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    ) || null
  );
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const store = await getStore();
  return store.coupons;
}

// ======================== USER OPERATIONS ========================

export async function findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const store = await getStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const store = await getStore();
  const u = store.users.find((user) => user._id === id);
  if (!u) return null;
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    addresses: u.addresses,
    createdAt: u.createdAt,
  };
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<User> {
  const store = await getStore();
  const existing = store.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error('User with this email already exists.');
  }

  const passwordHash = await hashPassword(userData.password);
  const newUser = {
    _id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email.toLowerCase(),
    passwordHash,
    role: 'customer' as const,
    phone: userData.phone || '',
    addresses: [],
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  await saveStore();

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone,
    addresses: newUser.addresses,
    createdAt: newUser.createdAt,
  };
}

// ======================== ADMIN ANALYTICS ========================

export async function getAdminStats() {
  const store = await getStore();

  const totalSales = store.orders
    .filter((o) => o.paymentInfo.status === 'paid')
    .reduce((acc, o) => acc + o.pricing.total, 0);

  const totalOrders = store.orders.length;
  const totalCustomers = store.users.filter((u) => u.role === 'customer').length;
  const totalProducts = store.products.length;

  const lowStockProducts = store.products.filter((p) => p.stock <= 5);

  const recentOrders = store.orders.slice(0, 8);

  const categoryBreakdown = store.categories.map((c) => ({
    category: c.name,
    count: store.products.filter((p) => p.category.toLowerCase() === c.slug.toLowerCase()).length,
  }));

  return {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders,
    categoryBreakdown,
  };
}
