"use client";

import React, { useRef } from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  link: string;
}

const BOOK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "100 Cái Chân của Nguyễn Ngọc Thuần",
    date: "15/04/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/3005/thumbs/100-cai-chan-nguyen-ngoc-thuan-diem-sach-01-thumb.jpg",
    link: "/about"
  },
  {
    id: "2",
    title: "Đầu Tư Vàng Thực Chiến: Sách dạy cách đầu tư vàng trong thời kỳ biến động",
    date: "15/04/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/3004/thumbs/dau-tu-vang-thuc-chien-du-hiep-diem-sach-01-thumb.jpg",
    link: "/about"
  },
  {
    id: "3",
    title: "Chúng Ta Sống Để Trở Về: Nhớ những cuộc trở về",
    date: "15/04/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/3003/thumbs/chung-ta-song-de-tro-ve-nguyen-phong-viet-diem-sach-01-thumb.jpg",
    link: "/about"
  },
  {
    id: "4",
    title: "“Khóc cười chuyện nghề y” và áp lực phía sau phòng trực",
    date: "15/04/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/3002/thumbs/khoc-cuoi-chuyen-nghe-y-nhat-ky-cua-mot-bac-si-tre-adam-kay-diem-sach-01-thumb.jpg",
    link: "/about"
  },
  {
    id: "5",
    title: "Sống Trong Cõi Vô Thường: Khi nghịch cảnh là thầy dạy vĩ đại nhất",
    date: "14/04/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/3001/thumbs/song-trong-coi-vo-thuong-om-swami-diem-sach-01-thumb.jpg",
    link: "/about"
  },
  {
    id: "6",
    title: "'Về miền bí ẩn' - hồi ký tu hành của học giả Phật giáo Ấn Độ",
    date: "31/01/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/3000/thumbs/ve-mien-bi-an-chuyen-phieu-luu-cua-mot-cuoc-doi-phi-thuong-diem-sach-01-01-thumb.jpg",
    link: "/about"
  },
  {
    id: "7",
    title: "Từ Bỏ Để Tự Do: Từ bỏ là thất bại hay là chiến lược sinh tồn khôn ngoan nhất?",
    date: "31/01/2026",
    imageUrl: "https://www.netabooks.vn/Data/Sites/1/News/2999/thumbs/tu-bo-de-tu-do-diem-sach-01-thumb.jpg",
    link: "/about"
  }
];

export function BookNewsSection() {
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
    <section id="tin-sach" className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5">
      {/* Title box */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#1b8a3e] rounded-full" />
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900">
            Tin Sách
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
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

      {/* News Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
      >
        {BOOK_NEWS.map((item) => (
          <div
            key={item.id}
            className="w-56 shrink-0 rounded-lg border border-gray-100 bg-white p-2.5 transition hover:shadow-md hover:border-gray-300"
          >
            <div className="h-32 w-full overflow-hidden rounded bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="mt-2.5 flex flex-col justify-between">
              <h3
                className="line-clamp-2 text-xs font-bold text-gray-900 hover:text-[#c92127] min-h-[34px] transition"
                title={item.title}
              >
                {item.title}
              </h3>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                <span>{item.date}</span>
                <Link
                  href={item.link}
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Xem chi tiết &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
