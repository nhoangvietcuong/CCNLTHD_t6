'use client';
import { use, useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const key = sessionStorage.getItem(`nextbooks_order_${id}`);
        if (!key) throw new Error('Không có khóa xem đơn hàng trong phiên trình duyệt này.');
        const response = await fetch(`/api/orders/${id}`, { headers: { 'X-Order-Key': key }, cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Không thể tải đơn hàng.');
        if (!controller.signal.aborted) setOrder(data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng.');
      }
    }
    void load();
    return () => controller.abort();
  }, [id]);
  return <div className="mx-auto max-w-2xl p-8 space-y-4">
    <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
    <p className="break-all">Mã đơn: {id}</p>
    {error ? <p role="alert">{error}</p> : !order ? <p>Đang tải...</p> : <>
      <p>{order.customerName} · {order.phone}</p><p>{order.address}</p>
      <p>Trạng thái: {order.status} · COD · Chưa thanh toán</p>
      <ul>{order.items.map((item) => <li key={item.productId}>{item.productName} × {item.quantity}: {formatPrice(item.subtotal)}</li>)}</ul>
      <p className="font-bold">Tổng tiền: {formatPrice(order.totalAmount)}</p>
    </>}
  </div>;
}
