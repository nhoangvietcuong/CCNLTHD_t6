"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: Product;
  showQuantity?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  product,
  showQuantity = false,
  className = "",
  size = "md",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product, quantity);
    setAdded(true);

    // Hiển thị phản hồi đã thêm trong 1.5 giây
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3.5 text-sm",
  };

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      {/* Bộ chọn số lượng (chỉ hiện khi showQuantity = true, ví dụ ở trang Chi tiết) */}
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center justify-center rounded-lg border border-slate-300 bg-white">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
            aria-label="Giảm số lượng"
          >
            -
          </button>
          <span className="w-10 text-center font-medium text-slate-800 text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      )}

      {/* Nút bấm Thêm vào giỏ hàng */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`flex-1 rounded-lg font-semibold transition-all cursor-pointer ${sizeStyles[size]} ${
          isOutOfStock
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : added
            ? "bg-emerald-600 text-white"
            : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
        }`}
      >
        {isOutOfStock ? "Tạm hết hàng" : added ? "✓ Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}
      </button>
    </div>
  );
}
