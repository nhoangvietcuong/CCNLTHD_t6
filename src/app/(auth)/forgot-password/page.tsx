import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu (demo)",
  description: "Đổi mật khẩu tài khoản thử nghiệm trên trình duyệt hiện tại.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
