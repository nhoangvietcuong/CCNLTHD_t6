import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  heading: string;
  subheading: string;
  children: ReactNode;
}

export default function AuthShell({ heading, subheading, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#faf6f2] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Về trang chủ nextBooks">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c92127] text-white shadow-sm transition group-hover:bg-[#a81a1f]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
              <path d="M5 19V5a2 2 0 0 1 2-2h12v18H7a2 2 0 0 1 0-4h12M9 7h6M9 11h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-2xl font-black tracking-tight text-[#c92127]">nextBooks<span className="text-xs font-bold text-slate-400">.vn</span></span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-slate-600 transition hover:text-[#c92127]">← Về trang chủ</Link>
      </div>

      <main className="mx-auto my-8 grid w-full max-w-6xl flex-1 overflow-hidden rounded-[28px] border border-[#f0e9e4] bg-white shadow-[0_24px_80px_rgba(91,60,39,0.10)] lg:grid-cols-[0.94fr_1.06fr]">
        <aside className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#a61b21] via-[#c92127] to-[#ea615b] p-12 text-white lg:flex">
          <div className="pointer-events-none absolute -left-32 -top-40 h-[380px] w-[380px] rounded-full border-[56px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 -right-32 h-[400px] w-[400px] rounded-full border-[70px] border-white/10" />
          <div className="relative z-10">
            <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold tracking-[0.14em]">CHÀO MỪNG BẠN</span>
            <h2 className="mt-9 max-w-sm text-[43px] font-extrabold leading-[1.18] tracking-tight">Mở trang sách mới. Khám phá điều tuyệt vời.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/85">Một tài khoản, hàng ngàn đầu sách và vô vàn ý tưởng đang chờ bạn tại nextBooks.</p>
          </div>
          <div className="relative z-10 mx-auto my-10 w-full max-w-[390px]" aria-hidden="true">
            <svg viewBox="0 0 420 330" fill="none" className="w-full drop-shadow-2xl">
              <ellipse cx="220" cy="287" rx="177" ry="23" fill="#791217" opacity=".24" />
              <g transform="translate(60 5)">
                <rect x="26" y="194" width="302" height="74" rx="9" fill="#E9B78A" />
                <rect x="38" y="203" width="278" height="51" rx="7" fill="#FFF7E7" />
                <path d="M46 215h263M46 225h263M46 235h263" stroke="#DFDBCE" strokeWidth="2" />
                <rect x="26" y="195" width="19" height="72" rx="4" fill="#A95044" />
                <rect x="51" y="139" width="257" height="59" rx="8" transform="rotate(-5 51 139)" fill="#EFC8B5" />
                <rect x="67" y="145" width="226" height="40" rx="5" transform="rotate(-5 67 145)" fill="#FFF8F1" />
                <rect x="51" y="139" width="17" height="58" rx="4" transform="rotate(-5 51 139)" fill="#6E88A8" />
                <g transform="rotate(9 190 86)">
                  <rect x="77" y="59" width="228" height="81" rx="8" fill="#274E62" />
                  <rect x="94" y="65" width="205" height="68" rx="5" fill="#F8F2D9" />
                  <path d="M110 79h173M110 89h173M110 99h173M110 109h173" stroke="#D8D5C9" strokeWidth="2" />
                  <rect x="77" y="59" width="19" height="81" rx="5" fill="#D38C49" />
                </g>
                <path d="M174 74 183 18l22 7-8 51" fill="#FFC970" />
                <path d="M228 83 249 24l18 13-22 49" fill="#EEDDC1" />
                <path d="M277 139 307 105l11 15-24 31" fill="#E8C399" />
              </g>
              <g fill="#FFF2CE">
                <path d="m41 88 5 12 13 4-13 5-5 12-5-12-13-5 13-4z" />
                <path d="m363 43 3 8 9 3-9 3-3 8-4-8-8-3 8-3z" />
              </g>
            </svg>
          </div>
          <div className="relative z-10 flex items-center gap-3 text-sm text-white/90">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">✦</span>
            <p><strong>Sách hay mỗi ngày</strong><span className="block text-xs text-white/70">Cảm hứng bắt đầu từ những trang sách.</span></p>
          </div>
        </aside>

        <section className="flex min-h-full flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 xl:px-20">
          <div className="mx-auto w-full max-w-[440px]">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#c92127]">TÀI KHOẢN NEXTBOOKS</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{heading}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{subheading}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </main>
      <p className="mx-auto text-center text-xs text-slate-400">© nextBooks · Giao diện đăng nhập/đăng ký dùng dữ liệu mô phỏng cho đồ án.</p>
    </div>
  );
}
