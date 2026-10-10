"use client";

import React, { useRef } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface UpcomingBooksSectionProps {
  products: Product[];
}

export function UpcomingBooksSection({ products }: UpcomingBooksSectionProps) {
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
    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5">
      {/* Title box */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-indigo-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900">
            Sách Sắp Phát Hành
          </h2>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
            Đặt trước nhận ưu đãi
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:border-[#c92127] hover:text-[#c92127] transition cursor-pointer"
          >
            &#10094;
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:border-[#c92127] hover:text-[#c92127] transition cursor-pointer"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Product carousel / grid */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar sm:gap-4"
      >
        {products.map((product) => (
          <div key={product.id} className="w-44 sm:w-52 shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
