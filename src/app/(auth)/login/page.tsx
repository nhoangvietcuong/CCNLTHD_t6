import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản nhà sách nextBooks.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
