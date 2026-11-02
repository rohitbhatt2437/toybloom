import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/data-store';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

