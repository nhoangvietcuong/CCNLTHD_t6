import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản tại nhà sách nextBooks.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
