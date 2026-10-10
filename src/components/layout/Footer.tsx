import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 w-full bg-white text-gray-700">
      {/* KEY SELLING POINTS (4 Lợi thế nổi bật của Netabooks) */}
      <section className="border-t border-b border-gray-200 bg-gray-50/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Điểm 1 */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#c92127]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Hơn 33.000 tựa sách hay
                </p>
                <p className="text-xs text-gray-500">
                  Tuyển chọn bởi nextBooks.vn
                </p>
              </div>
            </div>

            {/* Điểm 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#1b8a3e]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="16" height="13" x="2" y="4" rx="2" />
                  <path d="m22 7-7.1 4.7a2 2 0 0 1-2.2 0L5.6 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Miễn phí giao hàng
                </p>
                <p className="text-xs text-gray-500">
                  Từ 150k ở HCM và 300k trên TOÀN QUỐC
                </p>
              </div>
            </div>

            {/* Điểm 3 */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 12v10H4V12" />
                  <path d="M2 7h20v5H2z" />
                  <path d="M12 22V7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Quà tặng miễn phí
                </p>
                <p className="text-xs text-gray-500">
                  Bao sách miễn phí
                </p>
              </div>
            </div>

            {/* Điểm 4 */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Đổi trả nhanh chóng
                </p>
                <p className="text-xs text-gray-500">
                  Hàng bị lỗi được đổi trả nhanh chóng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MAIN (4 Cột chuẩn Netabooks) */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Cột 1: Thông tin liên hệ */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Nhà sách nextBooks Online
            </h3>
            <p className="text-xs text-gray-500">
              (Hoạt động từ 8h - 17h, thứ 2 - thứ 7)
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-[#c92127]">
                  📞
                </span>
                <span>
                  Gọi đặt hàng:{" "}
                  <a
                    href="tel:02873007684"
                    className="font-bold text-gray-900 hover:text-[#c92127]"
                  >
                    028 7300 7684
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-[#c92127]">
                  ✉️
                </span>
                <span>
                  Email:{" "}
                  <a
                    href="mailto:cskh@nextbooks.vn"
                    className="font-bold text-gray-900 hover:text-[#c92127]"
                  >
                    cskh@nextbooks.vn
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Cột 2: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Hỗ trợ khách hàng
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Hướng dẫn đặt hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Phương thức vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Dịch vụ giao sách đi nước ngoài
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Về NetaBooks & Sản phẩm khác */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Về nextBooks
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Giới thiệu nextBooks
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c92127]">
                  Tuyển dụng
                </Link>
              </li>
            </ul>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-gray-900">
              Sản phẩm khác
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a href="#tin-sach" className="text-gray-600 hover:text-[#c92127]">
                  Tin Sách
                </a>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-[#c92127]">
                  Tủ sách
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Kết nối & Gian hàng */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                Kết nối với nextBooks
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a
                    href="https://www.facebook.com/NetaBooks/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-[#c92127]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      f
                    </span>
                    <span>6.072 theo dõi trang</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/netabooks.vn/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-[#c92127]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-white font-bold text-[10px]">
                      📷
                    </span>
                    <span>355 theo dõi trang</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                Gian hàng của nextBooks
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a
                    href="https://tiki.vn/cua-hang/nha-sach-netabooks"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-[10px] text-white font-bold">
                      T
                    </span>
                    <span>Trên Tiki</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://shopee.vn/netabooks"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-orange-500 text-[10px] text-white font-bold">
                      S
                    </span>
                    <span>Trên Shopee</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM LINE (Bản quyền & Giấy phép) */}
      <div className="border-t border-gray-200 bg-gray-100/70 py-4 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 space-y-1">
          <p>© 2019 - Bản quyền của Công ty TNHH nextBooks Việt Nam – www.nextbooks.vn</p>
          <p className="text-[11px] text-gray-400">
            Giấy chứng nhận Đăng ký Kinh doanh số 0315442805 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp ngày 19/12/2018
          </p>
        </div>
      </div>
    </footer>
  );
}
