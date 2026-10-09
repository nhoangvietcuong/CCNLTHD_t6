"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface NewBooksSectionProps {
  products: Product[];
}

export function NewBooksSection({ products }: NewBooksSectionProps) {
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
          <div className="h-5 w-1 bg-[#c92127] rounded-full" />
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900">
            Sách Mới
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="text-xs font-semibold text-[#c92127] hover:underline"
          >
            Xem tất cả &rarr;
          </Link>
          <div className="hidden sm:flex items-center gap-1.5">
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
