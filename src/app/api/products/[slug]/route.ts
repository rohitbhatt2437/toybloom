import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getProductById, updateProduct, deleteProduct } from '@/lib/data-store';
import { verifyToken } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slugOrId = params.slug;
    let product = await getProductBySlug(slugOrId);
    if (!product) {
      product = await getProductById(slugOrId);
    }

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = req.cookies.get('toyzz_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const product = await updateProduct(params.slug, body);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = req.cookies.get('toyzz_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const deleted = await deleteProduct(params.slug);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

