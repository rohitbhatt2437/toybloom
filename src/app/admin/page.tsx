'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, Order, OrderStatus, AgeGroup } from '@/types';
import {
  DollarSign,
  Package,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<{
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockCount: number;
    lowStockProducts: Product[];
    recentOrders: Order[];
    categoryBreakdown: { category: string; count: number }[];
  } | null>(null);
  const [, setLoading] = useState(true);

  // Search & Filters in Inventory
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add/Edit Product Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    brand: '',
    category: 'play',
    categoryName: 'Play',
    ageGroup: '3-5 Years',
    price: 499,
    mrp: 699,
    purchasePrice: 300,
    stock: 15,
    featuredImage: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    isBestSeller: false,
  });

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, statsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/admin/stats'),
      ]);

      const prodData = await prodRes.json();
      const ordData = await ordRes.json();
      const statsData = await statsRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (ordData.success) setOrders(ordData.orders);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Stock quick adjustment
  const handleStockUpdate = async (productId: string, newStock: number) => {
    if (newStock < 0) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
        );
        showNotification('Stock quantity updated successfully.');
      }
    } catch {
      showNotification('Failed to update stock.');
    }
  };

  // Order status update
  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          comment: `Status modified in Admin Portal to ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        showNotification(`Order status updated to ${newStatus}`);
      }
    } catch {
      showNotification('Failed to update order status.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showNotification('Product deleted.');
      }
    } catch {
      showNotification('Failed to delete product.');
    }
  };

  // Open Edit modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      brand: p.brand,
      category: p.category,
      categoryName: p.categoryName,
      ageGroup: p.ageGroup,
      price: p.price,
      mrp: p.mrp,
      purchasePrice: p.purchasePrice || 0,
      stock: p.stock,
      featuredImage: p.featuredImage,
      shortDescription: p.shortDescription,
      description: p.description,
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
    });
    setModalOpen(true);
  };

  // Open Add modal
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      brand: 'Toyzz',
      category: 'play',
      categoryName: 'Play',
      ageGroup: '3-5 Years',
      price: 399,
      mrp: 599,
      purchasePrice: 200,
      stock: 10,
      featuredImage:
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      shortDescription: 'Exciting and educational toy for children.',
      description: 'Durable, safe, non-toxic toy designed for imaginative play and skill building.',
      isFeatured: false,
      isBestSeller: false,
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p._id === editingProduct._id ? data.product : p))
          );
          setModalOpen(false);
          showNotification('Product details updated successfully.');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          setModalOpen(false);
          showNotification('New toy created and published to store.');
        }
      }
    } catch {
      showNotification('Failed to save product.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const lowStockItems = products.filter((p) => p.stock <= 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
            Command Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Toyzz Store Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics, inventory levels, order dispatch, and catalogue controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-toy-coral text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-rose-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Toy</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{stats?.totalSales?.toLocaleString('en-IN') || 0}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> From paid orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalOrders || 0}</h3>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Active fulfilment pipeline
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toys in Store</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{products.length}</h3>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Across 5 Play Zones
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alert</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {lowStockItems.length} items
            </h3>
            <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
              Stock ≤ 4 units
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Urgent Inventory Refill Needed ({lowStockItems.length} Products)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl p-3 border border-amber-200/80 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-800 truncate">{p.title}</p>
                  <p className="text-[11px] text-amber-700 font-bold">Stock remaining: {p.stock}</p>
                </div>
                <button
                  onClick={() => handleStockUpdate(p._id, p.stock + 10)}
                  className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] whitespace-nowrap transition-colors"
                >
                  +10 Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'inventory'
              ? 'text-toy-coral border-b-2 border-toy-coral'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Catalogue ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'orders'
              ? 'text-toy-coral border-b-2 border-toy-coral'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* Tab 1: Product Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-4 p-6">
          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search toys by title or brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Zone:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Play Zones</option>
                <option value="build">Build</option>
                <option value="play">Play</option>
                <option value="discover">Discover</option>
                <option value="create">Create</option>
                <option value="learn">Learn</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Toy</th>
                  <th className="py-3 px-4">Zone / Age</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          <Image src={p.featuredImage} alt={p.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-800 truncate">{p.title}</p>
                          <p className="text-[10px] text-slate-400">{p.brand} • SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.ageGroup}</p>
                    </td>

                    <td className="py-3 px-4 font-black text-slate-900">
                      ₹{p.price}
                      {p.mrp > p.price && (
                        <span className="text-[10px] text-slate-400 line-through block font-normal">
                          MRP: ₹{p.mrp}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-semibold">
                      ₹{p.purchasePrice || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black px-2 py-0.5 rounded-full text-xs ${
                            p.stock <= 4 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStockUpdate(p._id, p.stock - 1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
                            title="Decrease 1"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleStockUpdate(p._id, p.stock + 1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
                            title="Increase 1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.title)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Dispatch Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-base">Order Fulfilment Console</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & City</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status & Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-black text-slate-900">{ord.orderNumber}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{ord.customer.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {ord.items.length} {ord.items.length === 1 ? 'toy' : 'toys'}
                    </td>

                    <td className="py-3.5 px-4 font-black text-toy-coral">
                      ₹{ord.pricing.total}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          ord.paymentInfo.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentInfo.method} ({ord.paymentInfo.status})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleOrderStatusChange(ord._id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-toy-coral/30 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? 'Edit Toy Details' : 'Add New Toy to Store'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Toy Title *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. 360° Astronaut Star Projector"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Play Zone Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categoryName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="build">Build</option>
                    <option value="play">Play</option>
                    <option value="discover">Discover</option>
                    <option value="create">Create</option>
                    <option value="learn">Learn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Age Group
                  </label>
                  <select
                    value={productForm.ageGroup}
                    onChange={(e) => setProductForm({ ...productForm, ageGroup: e.target.value as AgeGroup })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="0-2 Years">0-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="6-8 Years">6-8 Years</option>
                    <option value="9+ Years">9+ Years</option>
                    <option value="All Ages">All Ages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Stock Inventory Count
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.mrp}
                    onChange={(e) =>
                      setProductForm({ ...productForm, mrp: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  required
                  value={productForm.featuredImage}
                  onChange={(e) =>
                    setProductForm({ ...productForm, featuredImage: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-toy-coral text-white font-bold text-xs hover:bg-rose-600 shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
