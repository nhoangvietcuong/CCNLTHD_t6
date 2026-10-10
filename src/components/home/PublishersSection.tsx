"use client";

import React, { useRef } from "react";
import Link from "next/link";

const PUBLISHERS = [
  {
    name: "NXB Trẻ",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/nxb-tre.jpg"
  },
  {
    name: "Omega Plus Books",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/omega-plus.jpg"
  },
  {
    name: "Nhã Nam",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/nha-nam.jpg"
  },
  {
    name: "AlphaBooks",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/alphabooks.jpg"
  },
  {
    name: "1980Books",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/1980-books.jpg"
  },
  {
    name: "DominoBooks",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/dominobook.jpg"
  },
  {
    name: "NXB Kim Đồng",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/kim-dong.jpg"
  },
  {
    name: "Thái Hà",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/thai-ha-books.jpg"
  },
  {
    name: "Sách Tao Đàn",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/tao-dan.jpg"
  },
  {
    name: "Phanbooks",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/phan-books.jpg"
  },
  {
    name: "Văn Lang",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/nxb-van-lang.jpg"
  },
  {
    name: "SaigonBooks",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/Banner/sai-gon-books.jpg"
  }
];

export function PublishersSection() {
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

  return (
    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900">
          Nhà Xuất Bản &amp; Đối Tác Đồng Hành
        </h2>
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

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth hide-scrollbar items-center"
      >
        {PUBLISHERS.map((pub, idx) => (
          <Link
            key={idx}
            href="/products"
            className="w-36 sm:w-44 shrink-0 rounded border border-gray-200 p-2 bg-white transition hover:shadow-md hover:border-[#c92127]"
            title={pub.name}
          >
            <div className="h-16 w-full flex items-center justify-center overflow-hidden">
              <img
                src={pub.imageUrl}
                alt={pub.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition duration-200"
              />
            </div>
            <p className="mt-1 text-center text-[11px] font-medium text-gray-500 truncate">
              {pub.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
