"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { mockResetLocalPassword } from "@/services/auth.mock";

const fieldClass = "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#c92127] focus:ring-4 focus:ring-red-50";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess(false);
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await mockResetLocalPassword(email, password);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đặt lại mật khẩu mock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell heading="Khôi phục mật khẩu" subheading="Đổi mật khẩu cho tài khoản bạn đã tạo để thử nghiệm trên trình duyệt này.">
      <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <strong>Chế độ demo:</strong> Đây không phải tính năng gửi email khôi phục. Chỉ tài khoản mock bạn đã đăng ký trên trình duyệt hiện tại mới đổi được mật khẩu; không dùng với tài khoản thật.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email tài khoản mock</label>
          <input id="forgot-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="ban@example.com" />
        </div>
        <div>
          <label htmlFor="forgot-pass" className="mb-1.5 block text-sm font-semibold text-slate-700">Mật khẩu mới (từ 8 ký tự)</label>
          <div className="relative">
            <input id="forgot-pass" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={`${fieldClass} pr-20`} placeholder="Nhập mật khẩu mới" />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-3 px-2 text-xs font-semibold text-slate-600 hover:text-[#c92127]">{showPassword ? "Ẩn" : "Hiện"}</button>
          </div>
        </div>
        <div>
          <label htmlFor="forgot-confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">Xác nhận mật khẩu</label>
          <input id="forgot-confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={fieldClass} placeholder="Nhập lại mật khẩu mới" />
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Đã đổi mật khẩu mock. Bạn có thể đăng nhập bằng mật khẩu mới.</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#c92127] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#a81a1f] disabled:opacity-60">{loading ? "Đang cập nhật..." : "Đổi mật khẩu thử nghiệm"}</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link href="/login" className="font-semibold text-[#c92127] hover:underline">← Quay lại đăng nhập</Link></p>
    </AuthShell>
  );
}
