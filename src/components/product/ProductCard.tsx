"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0 && product.badge) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-lg border border-gray-200/90 bg-white p-3 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-lg ${className}`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Book Cover Image Area */}
        <div className="relative mb-2.5 flex h-48 w-full items-center justify-center overflow-hidden rounded bg-gray-50 sm:h-52">
          {product.imageUrl && !imgError && product.imageUrl !== "/placeholder.svg" ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4 text-center">
              <span className="text-2xl mb-1">📖</span>
              <span className="text-xs font-semibold text-gray-700 line-clamp-3">
                {product.name}
              </span>
            </div>
          )}

          {/* Badge: Sắp phát hành / Đặt trước */}
          {product.badge && (
            <span className="absolute top-2 left-2 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
              {product.badge}
            </span>
          )}

          {/* Discount tag badge top right if high discount */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute top-2 right-2 rounded bg-[#c92127] px-1.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="line-clamp-2 min-h-[38px] text-xs font-medium text-gray-900 transition-colors group-hover:text-[#c92127] sm:text-sm"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Author */}
        <p className="mt-1 truncate text-[11px] text-gray-500">
          {product.author || "Nhiều Tác Giả"}
        </p>

        {/* Price Area */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-[#c92127] sm:text-base">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discountPercent && discountPercent > 0 && (
                <span className="text-xs font-semibold text-[#c92127]">
                  -{discountPercent}%
                </span>
              )}
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>

        {/* Rating stars */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xs">
                ★
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            ({product.reviewCount ?? 0} nhận xét)
          </span>
        </div>
      </Link>

      {/* Action button */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0 && Boolean(product.badge)}
          className={`w-full rounded py-1.5 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
            added
              ? "bg-green-600 text-white"
              : product.stock <= 0 && product.badge
              ? "bg-amber-100 text-amber-800"
              : "border border-[#c92127] text-[#c92127] hover:bg-[#c92127] hover:text-white"
          }`}
        >
          {added ? (
            <>
              <span>✓</span> Đã thêm giỏ hàng
            </>
          ) : product.stock <= 0 && product.badge ? (
            <>
              <span>⏰</span> {product.badge}
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
