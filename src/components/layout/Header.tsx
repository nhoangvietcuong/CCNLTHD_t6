"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const CATEGORIES_LIST = [
  {
    name: "Sách Kinh Tế - Kỹ Năng",
    slug: "sach-kinh-te",
    subcategories: [
      "Kinh Tế - Chính Trị",
      "Nhân Vật - Bài Học Kinh Doanh",
      "Khởi Nghiệp",
      "Quản Trị - Lãnh Đạo",
      "Tài Chính, Kế Toán",
      "Kinh Tế Học",
      "Quản Trị Nhân Sự",
      "Chứng Khoán - Bất Động Sản - Đầu Tư",
      "Kỹ Năng Làm Việc",
      "Marketing - Bán Hàng"
    ]
  },
  {
    name: "Sách Nghệ Thuật Sống - Tâm Lý",
    slug: "sach-nghe-thuat-song-tam-ly",
    subcategories: [
      "Nghệ Thuật Sống",
      "Tâm Lý",
      "Tư Duy",
      "Hướng Nghiệp"
    ]
  },
  {
    name: "Sách Văn Học Việt Nam",
    slug: "sach-van-hoc-viet-nam",
    subcategories: [
      "Truyện ngắn - Tản văn",
      "Tiểu thuyết",
      "Tiểu thuyết lịch sử",
      "Tiểu sử - Hồi ký",
      "Phóng sự - Ký sự - Tùy bút",
      "Phê bình văn học",
      "Thơ"
    ]
  },
  {
    name: "Sách Văn học nước ngoài",
    slug: "sach-van-hoc-nuoc-ngoai",
    subcategories: [
      "Văn học hiện đại",
      "Văn học kinh điển",
      "Tiểu thuyết nước ngoài",
      "Giả tưởng - Kinh dị",
      "Truyện trinh thám",
      "Truyện kiếm hiệp",
      "Thần thoại - Cổ tích"
    ]
  },
  {
    name: "Sách Thiếu Nhi",
    slug: "sach-thieu-nhi",
    subcategories: [
      "Mẫu Giáo",
      "Nhi Đồng",
      "Thiếu Niên",
      "Văn Học Thiếu Nhi",
      "Kiến Thức - Bách Khoa",
      "Kỹ Năng Sống",
      "Truyện Cổ Tích",
      "Truyện Tranh",
      "Kiến Thức - Kỹ Năng Cho Trẻ"
    ]
  },
  {
    name: "Sách Giáo Dục - Gia Đình",
    slug: "sach-giao-duc-gia-dinh",
    subcategories: [
      "Giáo Dục",
      "Giới Tính",
      "Thai giáo",
      "Làm Cha Mẹ",
      "Dinh Dưỡng - Chăm Sóc Trẻ",
      "Ẩm Thực - Nấu Ăn",
      "Tiếng Anh",
      "Tham Khảo",
      "Ngoại Ngữ Khác"
    ]
  },
  {
    name: "Sách Lịch Sử",
    slug: "sach-lich-su",
    subcategories: ["Lịch Sử Việt Nam", "Lịch Sử Thế Giới"]
  },
  {
    name: "Sách Văn Hóa - Nghệ Thuật",
    slug: "sach-van-hoa-nghe-thuat",
    subcategories: [
      "Văn Hóa",
      "Nghệ Thuật",
      "Phong Tục - Tập Quán",
      "Kiến Trúc",
      "Phong Thủy - Chiêm Tinh",
      "Du Lịch"
    ]
  },
  {
    name: "Sách Khoa Học - Triết Học",
    slug: "sach-khoa-hoc-triet-hoc",
    subcategories: [
      "Triết Học Phương Tây",
      "Minh Triết Phương Đông",
      "Khoa Học - Công Nghệ"
    ]
  },
  {
    name: "Sách Tâm Linh - Tôn Giáo",
    slug: "sach-tam-linh-ton-giao",
    subcategories: ["Phật Giáo", "Thiền Định", "Tôn Giáo Khác"]
  },
  {
    name: "Sách Y Học - Thực Dưỡng",
    slug: "sach-y-hoc-thuc-dung",
    subcategories: [
      "Chăm Sóc Sức Khỏe",
      "Thực Dưỡng",
      "Y Học",
      "Đông Y - Cổ Truyền",
      "Thiền - Yoga"
    ]
  }
];

export default function Header() {
  const router = useRouter();
  const { totalItems, isMounted } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* MIDDLE HEADER */}
      <div className="border-b border-gray-100 bg-white py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-1.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c92127] text-white shadow-xs group-hover:bg-[#a81a1f] transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#c92127]">
                  nextBooks
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest -mt-1">
                  Nhà sách trực tuyến
                </span>
              </div>
            </Link>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="relative hidden md:flex flex-1 max-w-xl items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Bạn tìm sách gì?"
                className="w-full rounded-full border border-gray-300 bg-gray-50/70 py-2.5 pl-5 pr-14 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#c92127] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c92127] transition"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute right-1 top-1 bottom-1 flex w-12 items-center justify-center rounded-full bg-[#c92127] text-white hover:bg-[#a81a1f] transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Header items: Hotline, User Account, Cart */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Hotline */}
            <a
              href="tel:02873007684"
              className="hidden xl:flex items-center gap-2 text-left group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#c92127] group-hover:bg-[#c92127] group-hover:text-white transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="text-xs">
                <div className="text-gray-500">Gọi đặt hàng</div>
                <div className="font-bold text-gray-900 group-hover:text-[#c92127]">
                  028 7300 7684
                </div>
              </div>
            </a>

            {/* Account Login */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLoginModalOpen(!loginModalOpen)}
                className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-[#c92127] transition cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="hidden sm:inline-block">Đăng nhập</span>
              </button>

              {/* Login dropdown preview */}
              {loginModalOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Tài khoản nextBooks
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Đăng nhập để theo dõi đơn hàng và hưởng ưu đãi tích lũy.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Tính năng đăng nhập thành viên đang được kết nối.");
                      setLoginModalOpen(false);
                    }}
                    className="w-full rounded bg-[#c92127] py-2 text-xs font-semibold text-white hover:bg-[#a81a1f] transition cursor-pointer mb-2"
                  >
                    Đăng nhập / Đăng ký
                  </button>
                  <div className="text-center">
                    <Link
                      href="/about"
                      onClick={() => setLoginModalOpen(false)}
                      className="text-[11px] text-gray-500 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-[#c92127] transition"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#c92127]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#c92127] px-1 text-[10px] font-bold text-white shadow-xs">
                  {isMounted ? totalItems : 0}
                </span>
              </div>
              <span className="hidden sm:inline-block">GIỎ HÀNG</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2.5 px-4 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bạn tìm sách gì?"
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-11 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#c92127] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 flex w-9 items-center justify-center rounded-full bg-[#c92127] text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* 3. BOTTOM HEADER - NAVIGATION & CATEGORY DROPDOWN */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Category Dropdown Button */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="flex items-center gap-2 bg-[#c92127] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#a81a1f] transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span>TẤT CẢ DANH MỤC</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  categoryMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Flyout Panel */}
            {categoryMenuOpen && (
              <div className="absolute left-0 top-full z-50 flex w-[260px] lg:w-[680px] bg-white border border-gray-200 shadow-2xl">
                {/* Main category column */}
                <div className="w-[260px] border-r border-gray-200 py-1 max-h-[460px] overflow-y-auto">
                  {CATEGORIES_LIST.map((cat, idx) => (
                    <div
                      key={cat.slug}
                      onMouseEnter={() => setActiveCategoryIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs font-medium cursor-pointer transition ${
                        activeCategoryIndex === idx
                          ? "bg-red-50 text-[#c92127] font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#c92127]"
                      }`}
                    >
                      <Link
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setCategoryMenuOpen(false)}
                        className="flex-1 truncate"
                      >
                        {cat.name}
                      </Link>
                      <span className="text-[10px] text-gray-400">&rsaquo;</span>
                    </div>
                  ))}
                </div>

                {/* Subcategories Flyout (Desktop only) */}
                <div className="hidden lg:block flex-1 p-5 bg-white max-h-[460px] overflow-y-auto">
                  {activeCategoryIndex !== null && CATEGORIES_LIST[activeCategoryIndex] && (
                    <div>
                      <h4 className="text-sm font-bold text-[#c92127] border-b border-gray-100 pb-2 mb-3">
                        {CATEGORIES_LIST[activeCategoryIndex].name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {CATEGORIES_LIST[activeCategoryIndex].subcategories.map(
                          (sub) => (
                            <Link
                              key={sub}
                              href={`/products?category=${CATEGORIES_LIST[activeCategoryIndex].slug}`}
                              onClick={() => setCategoryMenuOpen(false)}
                              className="text-gray-600 hover:text-[#c92127] hover:underline py-1"
                            >
                              {sub}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase text-gray-700">
            <Link
              href="/products"
              className="hover:text-[#c92127] transition py-3"
            >
              Khuyến mãi
            </Link>

            {/* Dropdown: Hỗ trợ khách hàng */}
            <div className="relative group py-3">
              <span className="flex items-center gap-1 hover:text-[#c92127] cursor-pointer">
                Hỗ trợ khách hàng
                <span className="text-[10px]">&#9662;</span>
              </span>
              <div className="absolute left-0 top-full hidden w-56 rounded border border-gray-100 bg-white py-2 shadow-lg group-hover:block z-40">
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Hướng dẫn đặt hàng
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Phương thức thanh toán
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Phương thức vận chuyển
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Chính sách đổi trả
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Chính sách bảo mật
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>

            <a
              href="#tin-sach"
              className="hover:text-[#c92127] transition py-3"
            >
              Tin Sách
            </a>

            <Link
              href="/categories"
              className="hover:text-[#c92127] transition py-3"
            >
              Tủ sách
            </Link>

            <Link
              href="/about"
              className="hover:text-[#c92127] transition py-3"
            >
              Kiến Thức
            </Link>

            {/* Dropdown: Về nextBooks */}
            <div className="relative group py-3">
              <span className="flex items-center gap-1 hover:text-[#c92127] cursor-pointer">
                Về nextBooks
                <span className="text-[10px]">&#9662;</span>
              </span>
              <div className="absolute left-0 top-full hidden w-48 rounded border border-gray-100 bg-white py-2 shadow-lg group-hover:block z-40">
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Giới thiệu nextBooks
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#c92127]"
                >
                  Tuyển dụng
                </Link>
              </div>
            </div>
          </nav>

          {/* Right spotlight button */}
          <div className="hidden sm:flex items-center">
            <Link
              href="/products"
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
            >
              <span className="text-amber-500">★</span>
              <span>SÁCH MỚI TUYỂN CHỌN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-4/5 max-w-xs flex-col bg-white pb-6 shadow-xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-[#c92127] text-white">
              <span className="font-bold text-sm tracking-wide">
                DANH MỤC SÁCH
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Drawer Category List */}
            <div className="flex-1 overflow-y-auto px-2 py-3 divide-y divide-gray-100 text-xs">
              {CATEGORIES_LIST.map((cat) => (
                <div key={cat.slug} className="py-2 px-2">
                  <Link
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-gray-800 hover:text-[#c92127] block"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
              <div className="pt-4 px-2 space-y-2 text-gray-600 font-medium">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#c92127]"
                >
                  Khuyến mãi HOT
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#c92127]"
                >
                  Hỗ trợ khách hàng
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#c92127]"
                >
                  Về nextBooks
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
