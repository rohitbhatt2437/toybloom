import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  badgeColor: string;
  badgeBg: string;
  bannerImage: string;
  itemCount: number;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Package' },
    badgeColor: { type: String, default: '#0EA5E9' },
    badgeBg: { type: String, default: '#E0F2FE' },
    bannerImage: { type: String, default: '' },
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

