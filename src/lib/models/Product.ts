import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: string;
  categoryName: string;
  brand: string;
  ageGroup: string;
  price: number;
  mrp: number;
  purchasePrice: number;
  discountPercent: number;
  stock: number;
  images: string[];
  featuredImage: string;
  features: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isDealOfTheDay: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    ageGroup: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    purchasePrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    featuredImage: { type: String, required: true },
    features: [{ type: String }],
    specifications: { type: Map, of: String, default: {} },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isDealOfTheDay: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'draft', 'out_of_stock'], default: 'active' },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', description: 'text', brand: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

