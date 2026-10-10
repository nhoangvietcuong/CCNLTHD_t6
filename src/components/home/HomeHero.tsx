"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types";

interface HomeHeroProps {
  categories: Category[];
}

const DEFAULT_MAIN_BANNERS = [
  {
    title: "Chiến Dịch Diệt Chuột Ở Hà Nội - Đế Quốc, Dịch Bệnh Và Sự Hiện Đại Ở Việt Nam Thời Pháp Thuộc",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/chien-dich-diet-chuot-o-ha-noi-858x450.jpg",
    link: "/products"
  },
  {
    title: "Catherine Đại Đế - Thời Đại Vàng Son Của Đế Quốc Nga - Robert K. Massie (Bìa Cứng)",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/catherine-dai-de-thoi-dai-vang-son-cua-de-quoc-nga-robert-k-massie-bia-cung-858x450.jpg",
    link: "/products"
  }
];

const RIGHT_BANNERS = [
  {
    title: "Bộ Sách Hiểu Để Thương - Đủ Để An - Thích Pháp Hòa",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/bo-sach-hieu-de-thuong-du-de-an-thich-phap-hoa-bo-2-cuon-355x185.jpg",
    link: "/products"
  },
  {
    title: "Mấy Độ Cầu Vồng - Kawabata Yasunari",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/1may-do-cau-vong-kawabata-yasunari-355x185.jpg",
    link: "/products"
  },
  {
    title: "Đạo Đức AI - Nguyên Tắc Và Thực Hành - Đào Trung Thành",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/dao-duc-ai-nguyen-tac-va-thuc-hanh-dao-trung-thanh-355x185.jpg",
    link: "/products"
  }
];

export function HomeHero({ categories }: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  // Auto advance banner slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEFAULT_MAIN_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Use categories with subcategories or fallback
  const displayCategories = categories.length > 0 ? categories.slice(0, 11) : [];

  return (
    <div className="w-full">
      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 items-stretch">
        {/* CỘT TRÁI: Vertical Category Sidebar (Col 3 / 12) */}
        <div className="hidden lg:block lg:col-span-3 relative">
          <div className="h-full rounded-lg border border-gray-200 bg-white shadow-xs">
            <div className="divide-y divide-gray-100 text-xs">
              {displayCategories.map((cat, idx) => (
                <div
                  key={cat.id || cat.slug}
                  onMouseEnter={() => setHoveredCategory(idx)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="group relative"
                >
                  <Link
                    href={`/products?category=${cat.id || cat.slug}`}
                    className={`flex items-center justify-between px-3.5 py-2.5 transition ${
                      hoveredCategory === idx
                        ? "bg-red-50 text-[#c92127] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#c92127]"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#c92127]">
                      &rsaquo;
                    </span>
                  </Link>

                  {/* Flyout Submenu on Hover */}
                  {hoveredCategory === idx && cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="absolute left-full top-0 z-50 ml-1 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
                      <h4 className="text-xs font-bold text-[#c92127] border-b border-gray-100 pb-2 mb-2">
                        {cat.name}
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/products?category=${cat.id || cat.slug}`}
                            className="text-xs text-gray-600 hover:text-[#c92127] hover:underline py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT GIỮA: Main Banner Carousel (Col 6 / 12 on desktop, Col 9 if no right) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative h-64 sm:h-80 lg:h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-xs group">
            {DEFAULT_MAIN_BANNERS.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Link href={banner.link} className="block h-full w-full">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            ))}

            {/* Slider arrows */}
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + DEFAULT_MAIN_BANNERS.length) % DEFAULT_MAIN_BANNERS.length
                )
              }
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition hover:bg-black/60 cursor-pointer"
            >
              &#10094;
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % DEFAULT_MAIN_BANNERS.length)
              }
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition hover:bg-black/60 cursor-pointer"
            >
              &#10095;
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {DEFAULT_MAIN_BANNERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentSlide ? "w-6 bg-[#c92127]" : "w-2 bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: 3 Stacked Banners (Col 3 / 12) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between gap-2.5">
          {RIGHT_BANNERS.map((banner, i) => (
            <Link
              key={i}
              href={banner.link}
              className="group relative flex-1 overflow-hidden rounded-lg border border-gray-200 shadow-xs"
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Category Quick Grid (Matching Netabooks category-mobile) */}
      <div className="mt-4 lg:hidden rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
          <span>📚</span>
          <span>Khám phá danh mục sách</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {displayCategories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/products?category=${cat.id || cat.slug}`}
              className="flex items-center gap-2 rounded-md bg-gray-50 p-2 text-gray-700 hover:bg-red-50 hover:text-[#c92127] transition"
            >
              <span className="text-sm">📖</span>
              <span className="font-medium truncate">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
