"use client";

import React, { useRef } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface HotPromotionSectionProps {
  products: Product[];
}

export function HotPromotionSection({ products }: HotPromotionSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-8 rounded-lg border border-red-200/80 bg-gradient-to-r from-red-50/40 via-white to-red-50/40 p-4 shadow-xs sm:p-5">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-red-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c92127] text-white text-base shadow-xs animate-pulse">
            🔥
          </span>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-[#c92127]">
            Khuyến mãi HOT
          </h2>
          <span className="hidden sm:inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-[#c92127]">
            Giảm tới 30%
          </span>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-[#c92127] hover:text-[#c92127] shadow-2xs transition cursor-pointer"
          >
            &#10094;
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-[#c92127] hover:text-[#c92127] shadow-2xs transition cursor-pointer"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar sm:gap-4"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-44 sm:w-52 shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
