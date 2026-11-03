import fs from 'fs/promises';
import path from 'path';
import { Product, Category, Order, User, Coupon, OrderStatus, FilterState, OtpRecord } from '@/types';
import { initialCategories, initialProducts, initialCoupons } from './seed-data';
import { hashPassword } from './auth';
import { connectToDatabase } from './db';

interface StoreData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: (User & { passwordHash: string })[];
  coupons: Coupon[];
  otps: OtpRecord[];
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

  const defaultUsers: (User & { passwordHash: string })[] = [
    {
      _id: 'user-admin-001',
      name: 'Toy Store Admin',
      email: 'admin@toyzz.com',
      passwordHash: adminPassword,
      role: 'admin',
      phone: '',
      isEmailVerified: true,
      isPhoneVerified: true,
      registrationMethod: 'email',
      addresses: [],
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    products: initialProducts,
    categories: initialCategories,
    orders: [], // Real orders list starts empty
    users: defaultUsers,
    coupons: [], // Real coupons configured by admin
    otps: [],
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
    if (!memoryStore!.otps) {
      memoryStore!.otps = [];
    }
    // Ensure admin is verified
    const admin = memoryStore!.users.find((u) => u.email === 'admin@toyzz.com');
    if (admin) {
      admin.isEmailVerified = true;
      admin.isPhoneVerified = true;
      admin.registrationMethod = admin.registrationMethod || 'email';
    }
    return memoryStore!;
  } catch {
    memoryStore = await initDefaultStore();
    await saveStore();
    return memoryStore;
  }
}

async function syncToMongo(store: StoreData): Promise<void> {
  try {
    const mongooseConn = await connectToDatabase();
    if (!mongooseConn) return;
    const db = mongooseConn.connection.db;
    if (!db) return;

    if (store.orders.length > 0) {
      const ordersCol = db.collection('orders');
      for (const order of store.orders) {
        await ordersCol.updateOne({ _id: order._id as any }, { $set: order }, { upsert: true });
      }
    }
    if (store.users.length > 0) {
      const usersCol = db.collection('users');
      for (const user of store.users) {
        await usersCol.updateOne({ _id: user._id as any }, { $set: user }, { upsert: true });
      }
    }
    if (store.products.length > 0) {
      const productsCol = db.collection('products');
      for (const prod of store.products) {
        await productsCol.updateOne({ _id: prod._id as any }, { $set: prod }, { upsert: true });
      }
    }
  } catch (err) {
    console.error('MongoDB Atlas sync error:', err);
  }
}

async function saveStore(): Promise<void> {
  if (!memoryStore) return;
  await ensureDataDirectory();
  await fs.writeFile(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  syncToMongo(memoryStore).catch(() => {});
}

// ======================== PRODUCT OPERATIONS ========================

export async function getAllProducts(filters?: FilterState, isAdmin = false): Promise<Product[]> {
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

  if (!isAdmin) {
    return list.map(({ purchasePrice: _, ...publicProduct }) => publicProduct as Product);
  }

  return list;
}

export async function getProductBySlug(slug: string, isAdmin = false): Promise<Product | null> {
  const store = await getStore();
  const p = store.products.find((prod) => prod.slug === slug);
  if (!p) return null;
  if (!isAdmin) {
    const { purchasePrice: _, ...publicProduct } = p;
    return publicProduct as Product;
  }
  return p;
}

export async function getProductById(id: string, isAdmin = false): Promise<Product | null> {
  const store = await getStore();
  const p = store.products.find((prod) => prod._id === id);
  if (!p) return null;
  if (!isAdmin) {
    const { purchasePrice: _, ...publicProduct } = p;
    return publicProduct as Product;
  }
  return p;
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

  // Validate real products, selling prices, and stock
  for (const item of data.items) {
    const prod = store.products.find((p) => p._id === item.productId);
    if (!prod) {
      throw new Error(`Product "${item.title}" not found in inventory.`);
    }
    if (prod.status !== 'active') {
      throw new Error(
        `Product "${prod.title}" is in draft / pending price approval and cannot be purchased yet.`
      );
    }
    if (!prod.price || prod.price <= 0) {
      throw new Error(`Product "${prod.title}" does not have an approved store selling price.`);
    }
    if (prod.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${prod.title}". Requested: ${item.quantity}, Available: ${prod.stock}`
      );
    }
  }

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
  return store.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserByPhone(phone: string): Promise<(User & { passwordHash: string }) | null> {
  const store = await getStore();
  const cleanPhone = phone.replace(/\D/g, '');
  return (
    store.users.find((u) => {
      if (!u.phone) return false;
      const uClean = u.phone.replace(/\D/g, '');
      return uClean.slice(-10) === cleanPhone.slice(-10);
    }) || null
  );
}

export async function findUserByIdentifier(identifier: string): Promise<(User & { passwordHash: string }) | null> {
  if (identifier.includes('@')) {
    return findUserByEmail(identifier);
  }
  return findUserByPhone(identifier);
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
    isEmailVerified: Boolean(u.isEmailVerified),
    isPhoneVerified: Boolean(u.isPhoneVerified),
    registrationMethod: u.registrationMethod || 'email',
    addresses: u.addresses,
    createdAt: u.createdAt,
  };
}

export async function registerUser(userData: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  registrationMethod: 'email' | 'phone';
}): Promise<User> {
  const store = await getStore();

  if (userData.email) {
    const existingEmail = store.users.find(
      (u) => u.email && u.email.toLowerCase() === userData.email!.toLowerCase()
    );
    if (existingEmail) {
      throw new Error('An account with this email already exists. Please log in or use another email.');
    }
  }

  if (userData.phone) {
    const cleanPhone = userData.phone.replace(/\D/g, '');
    const existingPhone = store.users.find((u) => {
      if (!u.phone) return false;
      const uClean = u.phone.replace(/\D/g, '');
      return uClean.slice(-10) === cleanPhone.slice(-10);
    });
    if (existingPhone) {
      throw new Error('An account with this mobile number already exists. Please log in.');
    }
  }

  const passwordHash = await hashPassword(userData.password);
  const newUser = {
    _id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email ? userData.email.toLowerCase() : '',
    passwordHash,
    role: 'customer' as const,
    phone: userData.phone || '',
    isEmailVerified: false,
    isPhoneVerified: false,
    registrationMethod: userData.registrationMethod,
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
    isEmailVerified: newUser.isEmailVerified,
    isPhoneVerified: newUser.isPhoneVerified,
    registrationMethod: newUser.registrationMethod,
    addresses: newUser.addresses,
    createdAt: newUser.createdAt,
  };
}

export async function activateUserVerification(
  identifier: string,
  method: 'email' | 'phone'
): Promise<User> {
  const store = await getStore();
  const user = store.users.find((u) => {
    if (method === 'email') {
      return u.email && u.email.toLowerCase() === identifier.toLowerCase();
    } else {
      const cleanTarget = identifier.replace(/\D/g, '');
      const uClean = (u.phone || '').replace(/\D/g, '');
      return uClean.slice(-10) === cleanTarget.slice(-10);
    }
  });

  if (!user) {
    throw new Error('User account not found for activation.');
  }

  if (method === 'email') {
    user.isEmailVerified = true;
  } else {
    user.isPhoneVerified = true;
  }

  await saveStore();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    registrationMethod: user.registrationMethod,
    addresses: user.addresses,
    createdAt: user.createdAt,
  };
}

export async function findOrCreateFirebaseUser(params: {
  method: 'google' | 'phone';
  email?: string;
  phone?: string;
  name?: string;
}): Promise<User> {
  const store = await getStore();

  if (params.method === 'google' && params.email) {
    const cleanEmail = params.email.trim().toLowerCase();
    let existing = store.users.find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      existing.isEmailVerified = true;
      if (params.name && (!existing.name || existing.name === 'Google User')) {
        existing.name = params.name;
      }
      await saveStore();
      return {
        _id: existing._id,
        name: existing.name,
        email: existing.email,
        role: existing.role,
        phone: existing.phone,
        isEmailVerified: existing.isEmailVerified,
        isPhoneVerified: existing.isPhoneVerified,
        registrationMethod: existing.registrationMethod,
        addresses: existing.addresses,
        createdAt: existing.createdAt,
      };
    }

    // Create new Google verified user
    const randomHash = await hashPassword(`google-${Date.now()}-${Math.random()}`);
    const newUser = {
      _id: `user-${Date.now()}`,
      name: params.name || 'Google Customer',
      email: cleanEmail,
      passwordHash: randomHash,
      role: 'customer' as const,
      phone: params.phone || '',
      isEmailVerified: true,
      isPhoneVerified: false,
      registrationMethod: 'email' as const,
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
      isEmailVerified: newUser.isEmailVerified,
      isPhoneVerified: newUser.isPhoneVerified,
      registrationMethod: newUser.registrationMethod,
      addresses: newUser.addresses,
      createdAt: newUser.createdAt,
    };
  }

  if (params.method === 'phone' && params.phone) {
    const cleanDigits = params.phone.replace(/\D/g, '').slice(-10);
    let existing = store.users.find((u) => {
      if (!u.phone) return false;
      const uClean = u.phone.replace(/\D/g, '').slice(-10);
      return uClean === cleanDigits;
    });

    if (existing) {
      existing.isPhoneVerified = true;
      if (params.name && (!existing.name || existing.name === 'Toyzz Customer')) {
        existing.name = params.name;
      }
      await saveStore();
      return {
        _id: existing._id,
        name: existing.name,
        email: existing.email,
        role: existing.role,
        phone: existing.phone,
        isEmailVerified: existing.isEmailVerified,
        isPhoneVerified: existing.isPhoneVerified,
        registrationMethod: existing.registrationMethod,
        addresses: existing.addresses,
        createdAt: existing.createdAt,
      };
    }

    // Create new Phone verified user
    const randomHash = await hashPassword(`phone-${Date.now()}-${Math.random()}`);
    const newUser = {
      _id: `user-${Date.now()}`,
      name: params.name || 'Toyzz Customer',
      email: params.email || '',
      passwordHash: randomHash,
      role: 'customer' as const,
      phone: `+91${cleanDigits}`,
      isEmailVerified: false,
      isPhoneVerified: true,
      registrationMethod: 'phone' as const,
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
      isEmailVerified: newUser.isEmailVerified,
      isPhoneVerified: newUser.isPhoneVerified,
      registrationMethod: newUser.registrationMethod,
      addresses: newUser.addresses,
      createdAt: newUser.createdAt,
    };
  }

  throw new Error('Invalid Firebase authentication parameters.');
}

// ======================== OTP OPERATIONS ========================

export async function saveOtpRecord(otpRecord: OtpRecord): Promise<void> {
  const store = await getStore();
  // Invalidate any previous unconsumed OTPs for this identifier
  store.otps.forEach((o) => {
    if (o.identifier.toLowerCase() === otpRecord.identifier.toLowerCase() && !o.consumed) {
      o.consumed = true;
    }
  });

  store.otps.push(otpRecord);
  await saveStore();
}

export async function getLatestActiveOtp(
  identifier: string,
  type: 'registration' | 'login' | 'reset_password'
): Promise<OtpRecord | null> {
  const store = await getStore();
  const cleanId = identifier.includes('@')
    ? identifier.toLowerCase()
    : identifier.replace(/\D/g, '').slice(-10);

  const matched = store.otps
    .filter((o) => {
      const matchId = o.identifier.includes('@')
        ? o.identifier.toLowerCase()
        : o.identifier.replace(/\D/g, '').slice(-10);
      return matchId === cleanId && o.type === type && !o.consumed;
    })
    .sort((a, b) => b.expiresAt - a.expiresAt);

  return matched[0] || null;
}

export async function incrementOtpAttempts(otpId: string): Promise<number> {
  const store = await getStore();
  const otp = store.otps.find((o) => o._id === otpId);
  if (!otp) return 0;
  otp.attempts += 1;
  await saveStore();
  return otp.attempts;
}

export async function markOtpConsumed(otpId: string): Promise<void> {
  const store = await getStore();
  const otp = store.otps.find((o) => o._id === otpId);
  if (otp) {
    otp.consumed = true;
    await saveStore();
  }
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
