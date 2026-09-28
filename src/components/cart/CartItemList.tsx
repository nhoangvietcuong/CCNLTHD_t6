"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export function CartItemList() {
  const { items, updateQuantity, removeFromCart, isMounted } = useCart();

  if (!isMounted) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-20 bg-slate-100 rounded" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-16 w-16 text-slate-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-slate-900">Giỏ hàng của bạn đang trống</h2>
        <p className="mt-2 text-sm text-slate-500">
          Hãy dạo quanh hiệu sách và chọn cho mình những cuốn sách yêu thích nhé!
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Khám phá sách &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-lg font-semibold text-slate-900">
        Sách trong giỏ ({items.reduce((s, i) => s + i.quantity, 0)} cuốn)
      </h2>

      <div className="mt-6 divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4"
          >
            {/* Ảnh và thông tin sách */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                Bìa sách
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.product?.name ?? "Sách trong giỏ"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đơn giá: {formatPrice(item.unitPrice)}
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  className="mt-1 text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  Xóa khỏi giỏ
                </button>
              </div>
            </div>

            {/* Bộ tăng giảm số lượng & Thành tiền */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <div className="flex items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-sm cursor-pointer"
                  aria-label="Giảm"
                >
                  -
                </button>
                <span className="px-2 text-sm font-medium text-slate-800 min-w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.product?.stock ? item.quantity >= item.product.stock : false}
                  className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-sm disabled:opacity-40 cursor-pointer"
                  aria-label="Tăng"
                >
                  +
                </button>
              </div>

              <span className="text-base font-bold text-slate-900 min-w-24 text-right">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
        <Link
          href="/products"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          &larr; Tiếp tục chọn sách
        </Link>
      </div>
    </div>
  );
}
