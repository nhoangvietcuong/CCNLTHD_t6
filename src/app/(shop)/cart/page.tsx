"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CartItemList } from "@/components/cart/CartItemList";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { clearCart } = useCart();
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const handleOrderSuccess = (orderId: string) => {
    setPlacedOrderId(orderId);
    clearCart();
  };

  // Màn hình thông báo Đặt hàng thành công
  if (placedOrderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Đặt hàng thành công!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Cảm ơn bạn đã mua sách tại cửa hàng. Chúng tôi đã nhận được thông tin đơn hàng và sẽ sớm liên hệ giao sách cho bạn.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 border border-slate-100 text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase">Mã đơn hàng</p>
            <p className="mt-1 font-mono text-sm font-bold text-slate-900 break-all">
              {placedOrderId}
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
            >
              Tiếp tục mua sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Giỏ hàng &amp; Thanh toán
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Kiểm tra lại sách đã chọn và điền thông tin nhận hàng.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Cột trái: Danh sách các cuốn sách trong giỏ */}
        <div className="lg:col-span-7">
          <CartItemList />
        </div>

        {/* Cột phải: Form nhập thông tin khách hàng & đặt hàng */}
        <div className="lg:col-span-5">
          <CheckoutForm onSuccess={handleOrderSuccess} />
        </div>
      </div>
    </div>
  );
}
