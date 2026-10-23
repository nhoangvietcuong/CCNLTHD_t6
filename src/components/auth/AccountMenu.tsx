"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  getMockSession,
  getMockSessionSnapshot,
  subscribeMockSession,
  mockLogout,
} from "@/services/auth.mock";

/** Thay trực tiếp khối Account Login cũ trong Header bằng <AccountMenu />. */
export default function AccountMenu() {
  const sessionSnapshot = useSyncExternalStore(subscribeMockSession, getMockSessionSnapshot, () => null);
  const user = useMemo(() => sessionSnapshot ? getMockSession() : null, [sessionSnapshot]);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (container.current && !container.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, []);

  const logout = () => {
    mockLogout();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={container}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Mở menu tài khoản"
        className="flex items-center gap-2 text-xs font-medium text-gray-700 transition hover:text-[#c92127]">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span className="hidden max-w-[130px] truncate sm:inline-block">{user ? user.fullName : "Đăng nhập"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          {user ? (
            <>
              <p className="truncate text-sm font-bold text-gray-900">Xin chào, {user.fullName}</p>
              <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
              <div className="my-3 border-t border-gray-100" />
              <button type="button" onClick={logout} className="w-full rounded-lg bg-[#c92127] py-2.5 text-xs font-semibold text-white transition hover:bg-[#a81a1f]">Đăng xuất</button>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-gray-900">Tài khoản nextBooks</p>
              <p className="mb-4 mt-2 text-xs leading-5 text-gray-500">Đăng nhập để trải nghiệm mua sắm thuận tiện hơn.</p>
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg bg-[#c92127] py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#a81a1f]">Đăng nhập</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="mt-2 block rounded-lg border border-[#c92127] py-2.5 text-center text-xs font-semibold text-[#c92127] transition hover:bg-red-50">Đăng ký</Link>
              <Link href="/forgot-password" onClick={() => setOpen(false)} className="mt-3 block text-center text-xs text-slate-500 transition hover:text-[#c92127] hover:underline">Quên mật khẩu?</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
