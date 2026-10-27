"use client";

import React, { useRef, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useHydratedStore } from "@/hooks/useHydratedStore";
import { formatPrice } from "@/lib/utils";

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const items = useHydratedStore(useCartStore, (s) => s.items);
  const subtotal = useHydratedStore(useCartStore, (s) => s.getSubtotal()) ?? 0;

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const submitting = useRef(false);

  if (!items || items.length === 0) {
    return null;
  }

  // Kiểm tra tính hợp lệ của form (Client Validation)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (customerName.trim().length < 2 || customerName.trim().length > 120) {
      newErrors.customerName = "Họ và tên cần từ 2 đến 120 ký tự";
    }

    const phoneRegex = /^(?:0|\+?84)[35789]\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (ví dụ: 0901234567)";
    }

    if (!address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ nhận sách";
    } else if (address.trim().length < 5 || address.trim().length > 500) {
      newErrors.address = "Địa chỉ nhận sách cần từ 5 đến 500 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    submitting.current = true;

    try {
      // Chuẩn bị payload gửi lên API ở Phase 7
      // Client CHỈ gửi productId và quantity, KHÔNG gửi giá tiền hay tổng tiền!
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      // Persist before sending so a lost response/reload can retry the same intent.
      const serialized = JSON.stringify(payload);
      let previous: unknown = null;
      try { previous = JSON.parse(sessionStorage.getItem('nextbooks_order_intent') ?? 'null'); } catch { /* Replace corrupted intent. */ }
      const prior = previous && typeof previous === 'object' ? previous as Record<string, unknown> : null;
      const key = prior?.payload === serialized && typeof prior.key === 'string' && /^[a-f0-9]{64}$/.test(prior.key)
        ? prior.key : Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) => n.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem('nextbooks_order_intent', JSON.stringify({ payload: serialized, key }));
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: serialized,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đặt hàng không thành công");
      }
      if (typeof data.orderId !== 'string' || typeof data.totalAmount !== 'number') {
        throw new Error('Phản hồi đặt hàng không hợp lệ. Vui lòng thử lại.');
      }
      sessionStorage.setItem(`nextbooks_order_${data.orderId}`, key);
      sessionStorage.removeItem('nextbooks_order_intent');

      if (onSuccess) {
        onSuccess(data.orderId);
      }
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
      setServerError(errMessage);
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4">
        Thông tin đặt hàng
      </h2>

      {serverError && (
        <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
          ⚠️ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <p className="text-sm text-slate-600">Thanh toán khi nhận hàng (COD). Giá và tồn kho được xác nhận khi tạo đơn.</p>
        {/* Họ tên */}
        <div>
          <label htmlFor="customerName" className="block text-xs font-semibold text-slate-700 uppercase">
            Họ và tên người nhận <span className="text-rose-500">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            placeholder="Nguyễn Văn A"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: "" }));
            }}
            className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.customerName
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            }`}
          />
          {errors.customerName && (
            <p className="mt-1 text-xs text-rose-600">{errors.customerName}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase">
            Số điện thoại <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="0901234567"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.phone
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
          )}
        </div>

        {/* Địa chỉ giao hàng */}
        <div>
          <label htmlFor="address" className="block text-xs font-semibold text-slate-700 uppercase">
            Địa chỉ nhận sách <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="address"
            rows={2}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
            }}
            className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.address
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-rose-600">{errors.address}</p>
          )}
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Tiền sách tạm tính</span>
            <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Phí vận chuyển</span>
            <span className="font-medium text-emerald-600">Miễn phí</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
            <span>Tổng thanh toán</span>
            <span className="text-xl text-slate-900">{formatPrice(subtotal)}</span>
          </div>
        </div>

        {/* Nút đặt hàng */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isLoading ? "Đang xử lý đơn hàng..." : "Xác nhận đặt hàng"}
        </button>
      </form>
    </div>
  );
}
