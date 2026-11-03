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
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

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

  // Search & Filters in Inventory
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Inline Quick Price Approval State { [productId]: price }
  const [priceInputs, setPriceInputs] = useState<Record<string, number>>({});

  // Add/Edit Product Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    brand: '',
    category: 'play',
    categoryName: 'Play',
    ageGroup: '3-5 Years' as AgeGroup,
    price: 0,
    mrp: 0,
    purchasePrice: 0,
    stock: 0,
    featuredImage: '/products/TOY-0001.jpg',
    shortDescription: '',
    description: '',
    status: 'draft' as 'active' | 'draft' | 'out_of_stock',
  });

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, ordRes, statsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/admin/stats'),
      ]);

      const prodData = await prodRes.json();
      const ordData = await ordRes.json();
      const statsData = await statsRes.json();

      if (prodData.success) {
        setProducts(prodData.products);
        // Pre-fill price inputs for existing approved prices
        const initialPrices: Record<string, number> = {};
        prodData.products.forEach((p: Product) => {
          if (p.price && p.price > 0) {
            initialPrices[p._id] = p.price;
          }
        });
        setPriceInputs(initialPrices);
      }
      if (ordData.success) setOrders(ordData.orders);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // One-click price approval and activation
  const handleApprovePriceAndPublish = async (product: Product) => {
    const newPrice = priceInputs[product._id];
    if (!newPrice || newPrice <= 0) {
      alert('Please enter a valid selling price greater than ₹0.');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: newPrice,
          status: 'active',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, price: newPrice, status: 'active' } : p))
        );
        showNotification(`✅ "${product.title.slice(0, 30)}..." approved & published at ₹${newPrice}!`);
      }
    } catch {
      showNotification('Failed to update product price.');
    }
  };

  // Stock update
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
        showNotification('Product deleted from inventory.');
      }
    } catch {
      showNotification('Failed to delete product.');
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      brand: p.brand,
      category: p.category,
      categoryName: p.categoryName,
      ageGroup: p.ageGroup,
      price: p.price || 0,
      mrp: p.mrp || 0,
      purchasePrice: p.purchasePrice || 0,
      stock: p.stock,
      featuredImage: p.featuredImage,
      shortDescription: p.shortDescription,
      description: p.description,
      status: p.status,
    });
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      brand: 'Toy Store',
      category: 'play',
      categoryName: 'Play',
      ageGroup: '3-5 Years',
      price: 0,
      mrp: 0,
      purchasePrice: 0,
      stock: 1,
      featuredImage: '/products/TOY-0001.jpg',
      shortDescription: '',
      description: '',
      status: 'draft',
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
          showNotification('New toy added to inventory.');
        }
      }
    } catch {
      showNotification('Failed to save product.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const unapprovedProducts = products.filter((p) => !p.price || p.price <= 0 || p.status === 'draft');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
            Store Owner Console
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Real Inventory & Price Approval
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store&apos;s physical stock, approve retail selling prices, and oversee customer orders.
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
            className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Toy</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metric Cards (Real Values Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Sales</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{stats?.totalSales?.toLocaleString('en-IN') || 0}
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              {stats?.totalOrders || 0} Paid Orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{products.length} Items</h3>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Direct from Excel catalogue
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active For Sale</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {products.filter((p) => p.status === 'active' && p.price > 0).length} Published
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              With approved selling prices
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Price</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {unapprovedProducts.length} Drafts
            </h3>
            <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
              Set price below to activate
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Banner for Shop Owner */}
      {unapprovedProducts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Action Required: Set Store Selling Prices to Enable Online Sales</span>
          </div>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            The imported Excel sheet contained your wholesale purchase cost and marketplace reference prices (Amazon & Meesho), but <strong>no approved store retail prices</strong>. For safety, these {unapprovedProducts.length} toys are currently in <strong>DRAFT</strong> mode so customers cannot buy them with incorrect prices. Enter your desired retail price in the table below and click <strong>&quot;Approve & Publish&quot;</strong>.
          </p>
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
          Product Inventory & Prices ({products.length})
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
                placeholder="Search by SKU, title, brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Play Zone:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Zones</option>
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
                  <th className="py-3 px-3">SKU & Photo</th>
                  <th className="py-3 px-3">Toy Name & Zone</th>
                  <th className="py-3 px-3">Purchase Cost (Confidential)</th>
                  <th className="py-3 px-3">Amazon / Meesho Ref</th>
                  <th className="py-3 px-3">Stock Count</th>
                  <th className="py-3 px-3">Store Selling Price (₹)</th>
                  <th className="py-3 px-3">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isDraft = !p.price || p.price <= 0 || p.status === 'draft';

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Photo & SKU */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            <Image
                              src={p.featuredImage}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-800 text-[11px] block">
                            {p.sku}
                          </span>
                        </div>
                      </td>

                      {/* Name & Category */}
                      <td className="py-3 px-3">
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-800 line-clamp-2 leading-snug">
                            {p.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium capitalize mt-0.5 inline-block">
                            Zone: {p.categoryName} • Age: {p.ageGroup}
                          </span>
                        </div>
                      </td>

                      {/* Purchase Cost (Confidential) */}
                      <td className="py-3 px-3">
                        <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                          ₹{p.purchasePrice || 0}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">
                          Admin Only
                        </span>
                      </td>

                      {/* Marketplace Reference */}
                      <td className="py-3 px-3 text-slate-500">
                        <p className="text-[11px]">Amazon: <strong className="text-slate-700">₹{p.mrp || 'N/A'}</strong></p>
                        <p className="text-[10px] text-slate-400">{p.specifications?.['Marketplace Reference (Meesho)'] || ''}</p>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-800 text-xs px-2 py-0.5 bg-slate-100 rounded-md">
                            {p.stock}
                          </span>
                          <div className="flex gap-0.5">
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

                      {/* Selling Price Input */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Set ₹"
                            value={priceInputs[p._id] !== undefined ? priceInputs[p._id] : (p.price || '')}
                            onChange={(e) =>
                              setPriceInputs({
                                ...priceInputs,
                                [p._id]: Number(e.target.value),
                              })
                            }
                            className="w-20 px-2 py-1 rounded-lg border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                          />
                        </div>
                      </td>

                      {/* Status & Approval Button */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {isDraft ? (
                            <button
                              onClick={() => handleApprovePriceAndPublish(p)}
                              className="px-3 py-1.5 rounded-xl bg-toy-coral hover:bg-rose-600 text-white font-bold text-[11px] shadow-sm whitespace-nowrap transition-colors"
                            >
                              Approve & Publish
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live (₹{p.price})</span>
                            </div>
                          )}

                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.title)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Fulfilment Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-base">Real Order Fulfilment Console</h3>

          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No Customer Orders Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once customers place and pay for orders on your storefront, they will appear here in real-time for packing and dispatch.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? 'Edit Toy Information' : 'Add New Toy'}
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
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
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
                    <option value="play">Play</option>
                    <option value="discover">Discover</option>
                    <option value="create">Create</option>
                    <option value="learn">Learn</option>
                    <option value="build">Build</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Physical Stock Count *
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
                    Store Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Purchase Cost (₹ - Confidential)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.purchasePrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, purchasePrice: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Photograph Path or URL
                </label>
                <input
                  type="text"
                  required
                  value={productForm.featuredImage}
                  onChange={(e) =>
                    setProductForm({ ...productForm, featuredImage: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status
                </label>
                <select
                  value={productForm.status}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      status: e.target.value as 'active' | 'draft' | 'out_of_stock',
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="draft">Draft (Hidden from customers)</option>
                  <option value="active">Active (Available for purchase)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
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
                  Save Toy Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
