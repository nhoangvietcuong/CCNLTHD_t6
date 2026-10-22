"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
// import { DEMO_ACCOUNT } from "@/data/mock-users";
import { mockLogin, mockRegister } from "@/services/auth.mock";

type Mode = "login" | "register";
type FieldKey = "fullName" | "email" | "phone" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldKey | "terms", string>>;

const fieldStyle = "block w-full rounded-xl border border-slate-200 bg-[#fcfcfc] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#c92127] focus:bg-white focus:ring-4 focus:ring-red-50";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setRequestError("");
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (isRegister && form.fullName.trim().length < 2) {
      next.fullName = "Vui lòng nhập họ tên (ít nhất 2 ký tự).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Email không hợp lệ.";
    }
    if (isRegister && form.phone.trim() && !/^0\d{9}$/.test(form.phone.trim())) {
      next.phone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
    }
    if (!form.password) {
      next.password = "Vui lòng nhập mật khẩu.";
    } else if (isRegister && form.password.length < 8) {
      next.password = "Mật khẩu cần ít nhất 8 ký tự.";
    }
    if (isRegister && form.confirmPassword !== form.password) {
      next.confirmPassword = "Mật khẩu xác nhận chưa trùng khớp.";
    }
    if (isRegister && !acceptTerms) {
      next.terms = "Bạn cần đồng ý với điều khoản để tiếp tục.";
    }
    return next;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    setRequestError("");
    try {
      if (isRegister) {
        await mockRegister({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      } else {
        await mockLogin(form.email, form.password);
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heading={isRegister ? "Tạo tài khoản mới" : "Chào mừng trở lại!"}
      subheading={isRegister ? "Tham gia cộng đồng yêu sách và bắt đầu hành trình khám phá." : "Đăng nhập để lưu giỏ hàng và tận hưởng trải nghiệm mua sách."}
    >
      <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold">
        <Link href="/login" aria-current={!isRegister ? "page" : undefined}
          className={`rounded-lg py-2.5 text-center transition ${!isRegister ? "bg-white text-[#c92127] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
          Đăng nhập
        </Link>
        <Link href="/register" aria-current={isRegister ? "page" : undefined}
          className={`rounded-lg py-2.5 text-center transition ${isRegister ? "bg-white text-[#c92127] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
          Đăng ký
        </Link>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        {isRegister && (
          <div>
            <label htmlFor="auth-fullName" className="mb-1.5 block text-sm font-semibold text-slate-700">Họ và tên <span className="text-[#c92127]">*</span></label>
            <input id="auth-fullName" autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)}
              placeholder="Nguyễn Văn A" className={fieldStyle} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "error-fullName" : undefined} />
            {errors.fullName && <p id="error-fullName" className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email <span className="text-[#c92127]">*</span></label>
          <input id="auth-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)}
            placeholder="ban@example.com" className={fieldStyle} aria-invalid={!!errors.email} aria-describedby={errors.email ? "error-email" : undefined} />
          {errors.email && <p id="error-email" className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>
        {isRegister && (
          <div>
            <label htmlFor="auth-phone" className="mb-1.5 block text-sm font-semibold text-slate-700">Số điện thoại <span className="font-normal text-slate-400">(không bắt buộc)</span></label>
            <input id="auth-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)}
              placeholder="09xxxxxxxx" className={fieldStyle} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "error-phone" : undefined} />
            {errors.phone && <p id="error-phone" className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
          </div>
        )}
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="auth-password" className="text-sm font-semibold text-slate-700">Mật khẩu <span className="text-[#c92127]">*</span></label>
            {!isRegister && <Link href="/forgot-password" className="text-xs font-semibold text-[#c92127] hover:underline">Quên mật khẩu?</Link>}
          </div>
          <div className="relative">
            <input id="auth-password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"}
              value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="Nhập mật khẩu"
              className={`${fieldStyle} pr-16`} aria-invalid={!!errors.password} aria-describedby={errors.password ? "error-password" : undefined} />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute inset-y-0 right-3 px-2 text-xs font-semibold text-slate-500 hover:text-[#c92127]">
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
          {errors.password && <p id="error-password" className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
        </div>
        {isRegister && (
          <div>
            <label htmlFor="auth-confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">Xác nhận mật khẩu <span className="text-[#c92127]">*</span></label>
            <div className="relative">
              <input id="auth-confirm" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password"
                value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder="Nhập lại mật khẩu"
                className={`${fieldStyle} pr-16`} aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "error-confirmPassword" : undefined} />
              <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                className="absolute inset-y-0 right-3 px-2 text-xs font-semibold text-slate-500 hover:text-[#c92127]">
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {errors.confirmPassword && <p id="error-confirmPassword" className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
        )}
        {isRegister && (
          <div>
            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-600">
              <input type="checkbox" checked={acceptTerms} onChange={(event) => { setAcceptTerms(event.target.checked); setErrors((prev) => ({ ...prev, terms: undefined })); }}
                className="mt-1 h-4 w-4 shrink-0 accent-[#c92127]" />
              <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của nextBooks (mô phỏng).</span>
            </label>
            {errors.terms && <p className="mt-1.5 text-xs text-red-600">{errors.terms}</p>}
          </div>
        )}
        {requestError && (
          <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{requestError}</p>
        )}
        <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-[#c92127] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(201,33,39,0.18)] transition hover:bg-[#a81a1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60">
          {loading ? "Đang xử lý..." : isRegister ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
        <Link href={isRegister ? "/login" : "/register"} className="font-bold text-[#c92127] hover:underline">
          {isRegister ? "Đăng nhập ngay" : "Đăng ký miễn phí"}
        </Link>
      </p>
    </AuthShell>
  );
}
