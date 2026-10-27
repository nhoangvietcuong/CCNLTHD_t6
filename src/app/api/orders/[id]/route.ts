import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { getAdminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const key = request.headers.get('X-Order-Key') ?? '';
  if (!/^[a-f0-9]{64}$/.test(key) || createHash('sha256').update(key).digest('hex') !== id) {
    return NextResponse.json({ message: 'Không có quyền xem đơn hàng.' }, { status: 403 });
  }
  try {
    const snapshot = await getAdminDb().collection('orders').doc(id).get();
    if (!snapshot.exists) return NextResponse.json({ message: 'Không tìm thấy đơn hàng.' }, { status: 404 });
    const data = snapshot.data()!;
    return NextResponse.json({ orderId: id, customerName: data.customerName, phone: data.phone,
      address: data.address, items: data.items, totalAmount: data.totalAmount, status: data.status,
      paymentMethod: data.paymentMethod, paymentStatus: data.paymentStatus,
      createdAt: data.createdAt?.toDate().toISOString() ?? null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Không thể tải đơn hàng lúc này.' }, { status: 503 });
  }
}
